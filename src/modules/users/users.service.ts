import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PostgresErrorCode } from 'src/helpers/postgresErrorCode.enum';
import { AbstractService } from 'src/modules/common/abstract.service';
import { compareHash, hash } from 'src/modules/utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>) {
      super(usersRepository)
    }
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email })
    if (user) {
      throw new BadRequestException('User with that email already exists')
    }
    try {
      const newUser = this.usersRepository.create({ ...createUserDto})
      return this.usersRepository.save(newUser)
    } catch (error) {
      throw new BadRequestException('Something went wrong while creating a new user')
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = (await this.findById(id)) as User
    try{
      for (const key in user) {
        if(updateUserDto[key]) 
          user[key] = updateUserDto[key]
        else
          throw new BadRequestException('Updated fields have to be different than the old ones')
      }
      return this.usersRepository.save(user)
    }
    catch(err){
      throw new NotFoundException(`user with an id of ${id} not found`)
    }
  }

  async updatePassword(id: number, updateUserDto: UpdateUserDto):Promise<User>{
    const user = (await this.findById(id)) as User
    if (updateUserDto.password && updateUserDto.confirm_password) {
      if (updateUserDto.password !== updateUserDto.confirm_password) {
        throw new BadRequestException('Password do not match')
      }
      if (await compareHash(updateUserDto.password, user.password)) {
        throw new BadRequestException('New password cannot be the same as old password')
      }
      user.password = await hash(updateUserDto.password)
    }
    return this.usersRepository.save(user)
  }

  async updateUserImageId(id: number, avatar: string): Promise<User> {
    const user = await this.findById(id) as User
    if (avatar === user.avatar) {
      throw new BadRequestException('Avatars have to be different')
    }
    user.avatar = avatar
    return this.usersRepository.save(user)
  }
}