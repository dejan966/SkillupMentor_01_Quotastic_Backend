import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from 'entities/quote.entity';
import { User } from 'entities/user.entity';
import { Vote } from 'entities/vote.entity';
import Logging from 'library/Logging';
import { compareHash, hash } from 'utils/bcrypt';
import { NotBrackets, Repository } from 'typeorm';
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

  async findAll() {
    return await this.usersRepository.find({relations:['quote.user', 'vote.user'], });
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['quotes.votes.user', 'votes.quote']}) as User;
    return user;
  }

  async findBy(condition): Promise<User> {
    return this.usersRepository.findOne({ where: condition });
  }
  
  async userQuotes(userId:number){
    return await this.usersRepository.createQueryBuilder("user").innerJoin(Vote, 'vote', 'vote.user.id = user.id').innerJoin(Quote, 'quote', 'quote.id=vote.quote.id').innerJoin(Quote, 'quote2', 'quote2.user.id=user.id').select("COUNT(DISTINCT(vote.*)) as quotesUpvoted, COUNT(quote2.*) as userQuotes").where("user.id = :userId", {userId}).andWhere("vote.value = :value", {value:true}).getRawOne()
  }

  async userUpvotes(userId:number){
    return await this.usersRepository.createQueryBuilder("user").innerJoin(Vote, 'vote', 'vote.user.id = user.id').innerJoin(Quote, 'quote', 'quote.id=vote.quote.id').innerJoin(User, 'user2', 'user2.id=vote.user.id').select("COUNT(user2.*)", "quoteUpvotes").where("vote.value = :value", {value:true}).andWhere(new NotBrackets((qb)=>{
      qb.where({id: userId})
    })).getRawOne()
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const {password, confirm_password,...rest} = updateUserDto
    const user = await this.findById(id);
    try {
      for (const key in user) {
        if (rest[key]) user[key] = rest[key];
      }
      return this.usersRepository.save(user);
    } catch (error) {
      Logging.log(error)
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }

  async updatePassword(user: User, updateUserDto: {current_password: string, password:string, confirm_password:string}): Promise<User> {
    if (updateUserDto.password && updateUserDto.confirm_password) {
      if(!await compareHash(updateUserDto.current_password, user.password)) throw new BadRequestException('Incorrect current password')
      if (updateUserDto.password !== updateUserDto.confirm_password) throw new BadRequestException('Passwords do not match.')
      if (await compareHash(updateUserDto.password, user.password)) throw new BadRequestException('New password cannot be the same as old password.')
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

  async updateUserImageId(id:number, avatar:string): Promise<User> {
    const user = await this.findById(id)
    if (avatar === user.avatar) {
      throw new BadRequestException('Avatars have to be different.');
    }
    user.avatar = avatar;
    return this.usersRepository.save(user);
  }
}
