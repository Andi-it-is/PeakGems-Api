import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { CustomBadge } from "./CustomBadge"
import { RefreshToken } from "./RefreshToken"
import { UserRoleEnum } from "../lib/enums/UserRoleEnum"
import { Review } from "./Review"
import { GatheringAttendee } from "./GatheringAttendee"

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
        default: false
    })
        mustSetNewPassword: boolean

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

    @Column({
        nullable: true
    })
        avatar: string
    
    @CreateDateColumn()
        createdAt: Date;

    @UpdateDateColumn()
        updatedAt: Date;
    
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
        refreshTokens: RefreshToken[];
    
    @OneToMany(() => Review, review => review.user)
        reviews: Review[]

    @OneToMany(() => GatheringAttendee, attendee => attendee.user)
        gatheringAttendances: GatheringAttendee[]

    // Badges, die andere User diesem User gegeben haben (jedes Badge höchstens einmal pro User)
    @ManyToMany(() => CustomBadge, badge => badge.users)
    @JoinTable({
        name: "user_custom_badge",
        joinColumn: { name: "userId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "customBadgeId", referencedColumnName: "id" },
    })
        badges: CustomBadge[]


}
