import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { RefreshToken } from "./RefreshToken"
import { UserRoleEnum } from "../lib/enums/UserRoleEnum"
import { Review } from "./Review"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        unique: true
    })
        username: string

    @Column({
        nullable: false,
        select: false
    })
        passwordHash: string
    
    @Column({
        default: true
    })
        disabled: boolean

    @Column({
        default: 0
    })
        failedLoginTries: number;
    
    @Column({
        nullable: false
    })
        role: UserRoleEnum
    
    @CreateDateColumn()
        createdAt: Date;

    @UpdateDateColumn()
        updatedAt: Date;
    
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
        refreshTokens: RefreshToken[];
    
    @OneToMany(() => Review, review => review.user)
        reviews: Review[]


}
