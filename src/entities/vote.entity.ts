import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quote } from './quote.entity';

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    upvote:boolean
    
    @Column()
    downvote:boolean

    @ManyToOne(() => Quote, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'quote_id' })
    user: Quote | null
}