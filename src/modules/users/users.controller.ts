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
  HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto)
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findById(id)
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Patch(':id')
  async updatePassword(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto){
    return this.usersService.updatePassword(id, updateUserDto)
  }

  @Patch(':id')
  async updateAvatar(@Param('id') id: number, newAvatar: string){
    return this.usersService.updateUserImageId(id, newAvatar)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id)
  }
}