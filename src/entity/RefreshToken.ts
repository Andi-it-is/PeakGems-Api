import { PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class RefreshToken {

    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        unique: true
    })
    @Generated("uuid")
        token: string;

    @Column()
        validUntil: Date;

    @CreateDateColumn()
        lastUsed: Date;

    @Column({
        default: true
    })
        isActive: boolean;

    @CreateDateColumn({
        select: false
    })
        createdAt: Date;

    @ManyToOne(() => User, user => user.refreshTokens, { onDelete: "CASCADE" })
        user: User;
}
