import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { RefreshToken } from "./RefreshToken"

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
        role: string
    
    @CreateDateColumn()
        createdAt: Date;

    @UpdateDateColumn()
        updatedAt: Date;
    
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
        refreshTokens: RefreshToken[];


}
