import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
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
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    let hashedPassword: string = "";
    if(provider === "local"){
       hashedPassword = await bcrypt.hash(password, 12);
    }
    const providerId = `local-${uuidv4()}`;

    const publicId = this.makePublicId("LOC");
    // Create user
    const user = await this.prisma.user.create({
      data: {
        publicId,
        email,
        password: hashedPassword,
        name,
        accountType,
        provider,
        providerId
      },
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
        provider:true,
        providerId:true
      },
    });


    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
    };
  }


  async googleLogin(idToken: string){
    const { OAuth2Client } = await import('google-auth-library');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if(!clientId){
      throw new UnauthorizedException('Google client not configured');
    }
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if(!payload){
      throw new UnauthorizedException('Invalid Google token');
    }
    const email = payload.email ;
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }
    const name = (payload.name || payload.given_name || '').toString();
    const googleId = payload.sub ;

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { provider: 'google', providerId: googleId },
          { email }, 
        ],
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

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
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
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.accountType,
      },
      token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) return null;

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
