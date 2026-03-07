import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToOne } from "typeorm"
import { LocationStatusEnum } from "../lib/enums/LocationStatusEnum"
import { LocationTypeEnum } from "../lib/enums/LocationTypeEnum"
import { Gathering } from "./Gathering"
import { Review } from "./Review"

@Entity()
export class Location {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
    })
        name: string
        
    @Column({
        nullable: false,
    })
        address: string
    
    @Column({
        nullable: false,
    })
        status: LocationStatusEnum

    @Column({
        nullable: false,
    })
        type: LocationTypeEnum
    
    @CreateDateColumn()
        createdAt: Date

    @UpdateDateColumn()
        updatedAt: Date
    
    @OneToMany(() => Gathering, gathering => gathering.location)
        gathering: Gathering[]

    @OneToMany(() => Review, review => review.location)
        review: Review[]


}