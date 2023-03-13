import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quote } from './quote.entity';
import { User } from './user.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  value: boolean;


  @Column()
  quoteId: number;
  @ManyToOne(() => Quote, (quote) => quote.votes)
  @JoinColumn({name:"quoteId"})
  quote: Quote;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
