import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ nullable: true })
    first_name:string;

    @Column({ nullable: true })
    last_name:string;

    @Column({ unique: true })
    email:string;

    @Column()
    password:string

    @Column()
    avatar: string

    @Column()
    isActive:boolean

    @Column({ nullable: true, default: null })
    @Exclude()
    refresh_token: string
}
