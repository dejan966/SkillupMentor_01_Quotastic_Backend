import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterInsert } from 'typeorm';
import { Quote } from './quote.entity';
import { User } from './user.entity';

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id:number

    @Column({default:false})
    value:boolean

    @ManyToOne(() => Quote, quote=>quote.votes, { onDelete: 'SET NULL' })
    quote: Quote

    @ManyToOne(() => User, user=>user.votes, { onDelete: 'SET NULL' })
    user: User

    /* @AfterInsert()
    public async handleAfterInsert() {
        const quoteEntityUpdate = new Quote()
        quoteEntityUpdate.karma = quoteEntityUpdate.karma+1
        await getConnection().getRepository(Quote).save(quoteEntityUpdate);
    } */
}