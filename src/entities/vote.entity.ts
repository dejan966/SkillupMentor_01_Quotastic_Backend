import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Quote } from './quote.entity';
import { User } from './user.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  value: boolean;

  @ManyToOne(() => Quote, (quote) => quote.votes, { onDelete: 'SET NULL' })
  quote: Quote;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'SET NULL' })
  user: User;
}
