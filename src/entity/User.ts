import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
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
    
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
        refreshTokens: RefreshToken[];


}
