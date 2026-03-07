import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToOne } from "typeorm"
import { Location } from "./Location"


@Entity()
export class Gathering {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
    })
        date: Date
    
    @Column({
        nullable: false,
    })
        time: string
    
    @CreateDateColumn()
        createdAt: Date

    @UpdateDateColumn()
        updatedAt: Date
        
    @ManyToOne(() => Location, location => location.gathering)
        location: Location


}