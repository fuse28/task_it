import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private makePublicId(prefix: string) {
    // 6 char suffix to be compact
    return `${prefix}-${uuidv4().slice(0, 8)}`;
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, accountType } = createUserDto;

    // Check if user already exists
    const provider = 'local';
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    let hashedPassword: string = '';
    if (provider === 'local') {
      hashedPassword = await bcrypt.hash(password, 12);
    }
    const providerId = `local-${uuidv4()}`;

    const publicId = this.makePublicId('LOC');
    // Create user
    const user = await this.prisma.user.create({
      data: {
        publicId,
        email,
        password: hashedPassword,
        name,
        accountType,
        provider,
        providerId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
        provider: true,
        providerId: true,
      },
    });

    // issue token and generate session
    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      user.email,
    );
    await this.saveRefreshSession(Number(user.id), refreshToken);

    return {
      user,
      token: accessToken,
      refreshToken,
    };
  }

  async googleLogin(idToken: string) {
    const { OAuth2Client } = await import('google-auth-library');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new UnauthorizedException('Google client not configured');
    }
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }
    const email = payload.email;
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }
    const name = (payload.name || payload.given_name || '').toString();
    const googleId = payload.sub;

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ provider: 'google', providerId: googleId }, { email }],
      },
    });
    if (!user) {
      const publicId = this.makePublicId('GGL');
      user = await this.prisma.user.create({
        data: {
          publicId,
          email,
          name,
          accountType: 'personal',
          provider: 'google',
          providerId: googleId,
          password: '',
        },
      });
    } else {
      // if user existed but provider fields not set, update them
      if (user.provider !== 'google' || user.providerId !== googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { provider: 'google', providerId: googleId },
        });
      }
    }

    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      user.email,
    );
    await this.saveRefreshSession(Number(user.id), refreshToken);

    return { user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      user.email,
    );
    await this.saveRefreshSession(Number(user.id), refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.accountType,
      },
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) return null;

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateToken(userId: string | number, email: string) {
    const sub = typeof userId === 'number' ? String(userId) : userId;

    const accessToken = this.jwtService.sign(
      { sub, email },
      { expiresIn: '10m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub, email, type: 'refresh' },
      { expiresIn: '30d' },
    );
    return { accessToken, refreshToken };
  }

  async saveRefreshSession(userId: number, refreshToken: string) {
    const refreshHash = await bcrypt.hash(refreshToken, 12);
    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshHash,
      },
    });
    return session;
  }

  async refresh(providedRefreshToken: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(providedRefreshToken);

      if (payload?.type !== 'refresh') {
        throw new UnauthorizedException('Invalid Token Type');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const userId = Number(payload.sub);
    const email = payload.email as string;

    const sessions = await this.prisma.session.findMany({
      where: { userId, revokedAt: null },
      select: { id: true, refreshHash: true },
    });

    let matchedSession: { id: number; refreshHash: string } | null = null;

    for (const s of sessions) {
      const ok = await bcrypt.compare(providedRefreshToken, s.refreshHash);
      if (ok) {
        matchedSession = s;
        break;
      }
    }
    if (!matchedSession) {
      throw new UnauthorizedException('Refresh Token not recognized');
    }

    const { accessToken, refreshToken: newRt } = await this.generateToken(
      userId,
      email,
    );

    const newHash = await bcrypt.hash(newRt, 12);

    await this.prisma.session.update({
      where: { id: matchedSession.id },
      data: { refreshHash: newHash },
    });
    return { accessToken, refreshToken: newRt };
  }

  // Logout

  async logout(providedRefreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(providedRefreshToken);
      if (payload?.type !== 'refresh') {
        return { success: true };
      }
    } catch {
      return { success: true };
    }

    const userId = Number(payload.sub);

    const sessions = await this.prisma.session.findMany({
      where: { userId, revokedAt: null },
      select: { id: true, refreshHash: true },
    });

    let matchedSession: { id: number; refreshHash: string } | null = null;
    for (const s of sessions) {
      const ok = await bcrypt.compare(providedRefreshToken, s.refreshHash);
      if (ok) {
        matchedSession = s;
        break;
      }
    }

    if (!matchedSession) {
      return { success: true };
    }

    await this.prisma.session.update({
      where: { id: matchedSession.id },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }
}
