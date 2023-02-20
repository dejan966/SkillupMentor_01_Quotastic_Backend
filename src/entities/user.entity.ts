import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Quote } from './quote.entity';
import { Vote } from './vote.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column({ nullable: true })
    first_name:string

    @Column({ nullable: true })
    last_name:string

    @Column({ unique: true })
    email:string

    @Column()
    @Exclude()
    password:string

    @Column({default:'default-avatar.png'})
    avatar: string

    @Column({default:true})
    isActive:boolean

    @Column({ nullable: true, default: null })
    @Exclude()
    refresh_token: string

    @OneToMany(() => Quote, quote=>quote.user)
    quotes: Quote[]

    @OneToMany(() => Vote, vote=>vote.user)
    votes: Vote[]
}