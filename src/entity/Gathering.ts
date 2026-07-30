import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { Location } from "./Location"
import { GatheringAttendee } from "./GatheringAttendee"


@Entity()
export class Gathering {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
    })
        title: string

    @Column({
        type: "text",
        nullable: true,
    })
        description: string

    @Column({
        nullable: false,
    })
        startAt: Date

    @CreateDateColumn()
        createdAt: Date

    @UpdateDateColumn()
        updatedAt: Date

    @ManyToOne(() => Location, location => location.gatherings, { nullable: false })
        location: Location

    @OneToMany(() => GatheringAttendee, attendee => attendee.gathering)
        attendees: GatheringAttendee[]


}