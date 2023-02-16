import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService:JwtService,
    private readonly userService:UsersService
    ){
    
    }
  use(req: Request, res: Response, next: () => void) {
    next();
  }
}
