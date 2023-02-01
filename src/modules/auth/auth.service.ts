import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { hash } from '../utils/bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    //private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword: string = await hash(registerUserDto.password)
    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    })
    return user
  }

  async login(userFromRequest: User, res: Response): Promise<void> {
    const { password, ...user } = await this.usersService.findById(userFromRequest.id)
    //const accessToken = await this.generateToken(user.id, user.email, JwtType.ACCESS_TOKEN)
    //const accessTokenCookie = await this.generateCookie(accessToken, CookieType.ACCESS_TOKEN)
    //const refreshToken = await this.generateToken(user.id, user.email, JwtType.REFRESH_TOKEN)
    //const refreshTokenCookie = await this.generateCookie(refreshToken, CookieType.REFRESH_TOKEN)
    //try {
    //  await this.updateRtHash(user.id, refreshToken)
    //  res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]).json({ ...user })
    //} catch (error) {
    //  Logging.error(error)
    //  throw new InternalServerErrorException('Something went wrong while setting cookies into response header')
    //}
  }

/*   async signout(userId: number, res: Response): Promise<void> {
    const user = await this.usersService.findById(userId)
    await this.usersService.update(user.id, { refresh_token: null })
    try {
      res.setHeader('Set-Cookie', this.getCookiesForSignOut()).sendStatus(200)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while setting cookies into response header')
    }
  } */
}
