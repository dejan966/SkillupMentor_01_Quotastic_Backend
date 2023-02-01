import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Quote {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    karma:number;

    @Column()
    quote:string;
    
    @Column({ type: 'datetime', default: () => 'NOW()' })
    posted_when: string

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User | null
}
