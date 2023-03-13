import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Vote } from './vote.entity';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  karma: number;

  @Column()
  quote: string;

  @CreateDateColumn()
  posted_when: string;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.quotes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User

  @OneToMany(() => Vote, (vote) => vote.quote)
  votes: Vote[];
}
