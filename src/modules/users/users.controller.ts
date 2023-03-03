import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors, 
  ClassSerializerInterceptor, 
  HttpCode, 
  HttpStatus, 
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserData } from 'src/interfaces/user.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@GetCurrentUser() user: User){
    return user;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/me/update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@GetCurrentUser() user: User, @Body() updateUserDto: {current_password: string, password:string, confirm_password:string}) {
    return this.usersService.updatePassword(user, updateUserDto);
  }

  @Patch('/me/update-avatar')
  @UseGuards(JwtAuthGuard)
  async updateAvatar(@GetCurrentUser() user: User, @Body() updateUserDto:{avatar:string}) {
    return this.usersService.updateUserImageId(user, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
