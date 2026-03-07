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
    
    @ManyToOne(() => Location, location => location.review)
        location: Location




}