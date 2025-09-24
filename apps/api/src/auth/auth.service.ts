import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
  ) {}

  async validateAndLogin(email: string, password: string) {
  try {
    console.log('🔎 Login attempt:', email);

    const user = await this.users.findOne({ where: { email } });
    console.log('🔎 Found user:', user);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log('🔎 Password match:', ok);

    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role, orgId: user.orgId };
    console.log('🔎 Payload for JWT:', payload);

    const token = this.jwt.sign(payload);
    console.log('✅ Token generated successfully');

    return { access_token: token };
  } catch (err) {
    console.error('❌ Auth error:', err);
    throw err;
  }
}


}


