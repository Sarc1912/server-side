import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/User';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async register(userData: any): Promise<any> {
    const { email, password, fullName, nationalId, phone, address } = userData;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
      nationalId,
      phone,
      address,
    });

    await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    // Return user without password and the token
    const { password: _, ...result } = user;
    return {
      user: result,
      access_token: this.jwtService.sign(payload),
    };
  }
}
