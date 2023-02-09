import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Quote {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({default: 0})
    karma:number;

    @Column()
    quote:string;
    
    @CreateDateColumn()
    posted_when: string

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User
}