import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToOne } from "typeorm"
import { User } from "./User"
import { Location } from "./Location"

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'float',
        nullable: false,
    })
    rating: number

    @Column({
        nullable: false,
        default: "01.01.1970"
    })
    visitedDate: string

    @Column({
        nullable: true,
    })
    orderedDish: string

    @Column({
        nullable: false,
        type: 'text'
    })
    comment: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date


    @ManyToOne(() => User, user => user.reviews)
    user: User

    @ManyToOne(() => Location, location => location.reviews)
    location: Location




}