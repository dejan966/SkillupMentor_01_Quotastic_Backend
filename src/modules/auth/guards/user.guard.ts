import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
/*     const {user:User, params} = context.switchToHttp().getRequest()
    for(const iterator of user.first_name) */
    return true;
  }
}