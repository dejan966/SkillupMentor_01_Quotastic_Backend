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
  UseGuards,
  BadRequestException,
  UploadedFile
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { saveImageToStorage, isFileExtensionSafe, removeFile } from 'src/helpers/imageStorage';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

@Post('upload/:id')
  @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(@UploadedFile() file: Express.Multer.File, @Param('id') id: number): Promise<User> {
    const filename = file?.filename

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'uploads')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.usersService.updateUserImageId(id, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
  } 

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@GetCurrentUser() user: User){
    return user;
  }

  @Get('me/upvoted')
  @UseGuards(JwtAuthGuard)
  async currUserUpvoted(@GetCurrentUser() user: User){
    return this.usersService.userQuotes(user.id)
  }

  @Get('me/upvotes')
  @UseGuards(JwtAuthGuard)
  async currUserUpvotes(@GetCurrentUser() user: User){
    return this.usersService.userUpvotes(user.id)
  }

  @Get('upvoted/:id')
  async userUpvoted(@Param('id') userId: number){
    return this.usersService.userQuotes(userId)
  }

  @Get('upvotes/:id')
  async userUpvotes(@Param('id') userId: number){
    return this.usersService.userUpvotes(userId)
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

  

/*   @Patch('/me/update-avatar')
  @UseGuards(JwtAuthGuard)
  async updateAvatar(id:number, @Body() updateUserDto:{avatar:string}) {
    return this.usersService.updateUserImageId(id, updateUserDto);
  } */

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
