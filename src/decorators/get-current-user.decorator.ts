import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../entities/user.entity'

export const GetCurrentUser = createParamDecorator((_: undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  const user = request.user as User
  return user
})
