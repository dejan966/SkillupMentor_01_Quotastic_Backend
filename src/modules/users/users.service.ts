import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PostgresErrorCode } from 'src/helpers/postgresErrorCode.enum';
import Logging from 'src/library/Logging';
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
    const { email, password, confirm_password, ...data } = updateUserDto
    if (user.email !== email && email) {
      user.email = email
    } else if (email && user.email === email) {
      throw new BadRequestException('User with that email already exists')
    }
    if (password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Password do not match')
      }
      if (await compareHash(password, user.password)) {
        throw new BadRequestException('New password cannot be the same as old password')
      }
      user.password = await hash(password)
    }
    try {
      Object.entries(data).map((entry) => {
        user[entry[0]] = entry[1]
      })
      return this.usersRepository.save(user)
    } catch (error) {
      Logging.error(error)
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email alread exists')
      }
      throw new InternalServerErrorException('Something went wrong while updating the user')
    }
  }

  async updateUserImageId(id: number, avatar: string): Promise<User> {
    const user = await this.findById(id)
    return this.update(user.id, { avatar })
  }
}
