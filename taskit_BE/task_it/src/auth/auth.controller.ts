import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class GoogleLoginDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return {
      message: 'Login successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  @Post('googleSignin')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    const { user, accessToken, refreshToken } =
      await this.authService.googleLogin(googleLoginDto.idToken);

    return {
      message: 'Google login successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return this.authService.refresh(refreshToken);
  }
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return this.authService.logout(refreshToken);
  }
}
