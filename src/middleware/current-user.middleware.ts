import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/modules/users/users.service';

declare global {
  namespace Express {
    interface Request {
      current_user?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { access_token } = req.cookies;
    try {
      const { sub } = await this.jwtService.verify(access_token);
      req.current_user = await this.userService.findById(sub);
    } catch {}
    next();
  }
}
