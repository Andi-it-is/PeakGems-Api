import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToOne } from "typeorm"
import { LocationStatusEnum } from "../lib/enums/LocationStatusEnum"
import { LocationTypeEnum } from "../lib/enums/LocationTypeEnum"
import { Gathering } from "./Gathering"
import { Review } from "./Review"
import { LocationImage } from "./LocationImage"


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
    gatherings: Gathering[]

    @OneToMany(() => Review, review => review.location)
    reviews: Review[]

    @OneToMany(() => LocationImage, image => image.location)
    images: LocationImage[]


}