import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { current_user, params } = context.switchToHttp().getRequest()
    for (const iterator of current_user.quotes) {
      if (iterator.id == params.id) return true
    }
    return false
  }
}