import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { compareHash, hash } from 'src/modules/utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with that email already exists.');
    }
    try {
      const newUser = this.usersRepository.create({ ...createUserDto });
      return this.usersRepository.save(newUser);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException('Something went wrong while creating a new user.');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['quotes', 'votes', 'votes.quote'] });
    return user;
  }

  async findBy(condition): Promise<User> {
    return this.usersRepository.findOne({ where: condition });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    try {
      for (const key in user) {
        if (updateUserDto[key]) user[key] = updateUserDto[key];
      }
      return this.usersRepository.save(user);
    } catch (error) {
      Logging.log(error)
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }

  async updatePassword(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (updateUserDto.password && updateUserDto.confirm_password) {
      if (updateUserDto.password !== updateUserDto.confirm_password) {
        throw new BadRequestException('Passwords do not match.');
      }
      if (await compareHash(updateUserDto.password, user.password)) {
        throw new BadRequestException('New password cannot be the same as old password.');
      }
      user.password = await hash(updateUserDto.password);
    }
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    try {
      return this.usersRepository.remove(user);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException('Something went wrong while deleting the account');
    }
  }

  async updateUserImageId(id: number, avatar: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (avatar === user.avatar) {
      throw new BadRequestException('Avatars have to be different.');
    }
    user.avatar = avatar;
    return this.usersRepository.save(user);
  }
}
