import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, HttpCode, HttpStatus, Res, Req, UseGuards, Get } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express'
import { User } from 'src/entities/user.entity';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { UserData } from 'src/interfaces/user.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto):Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser, @Res() res: Response):Promise<void> {
    return this.authService.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@GetCurrentUser() userData: User, @Res() res: Response): Promise<void> {
    return this.authService.signout(userData.id, res)
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@GetCurrentUser() user: User): Promise<UserData> {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar: user.avatar,  
    }
  }
}