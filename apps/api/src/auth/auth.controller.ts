import { Controller, Post, Body } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(4) password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.validateAndLogin(dto.email, dto.password);
  }

  
}


