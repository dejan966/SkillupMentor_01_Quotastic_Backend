import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { Public } from 'decorators/public.decorator';
import { Response } from 'express';
import { User } from 'entities/user.entity';
import { RequestWithUser } from 'interfaces/auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @UseGuards(NotAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard, NotAuthGuard)
  async login(@Req() req: RequestWithUser, @Res() res: Response): Promise<void> {
    return this.authService.login(req.user, res);
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signout(@GetCurrentUser() userData: User, @Res() res: Response): Promise<void> {
    return this.authService.signout(userData.id, res);
  }
}
