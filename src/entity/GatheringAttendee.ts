import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from "typeorm"
import { Gathering } from "./Gathering"
import { User } from "./User"
import { GatheringAttendanceStatusEnum } from "../lib/enums/GatheringAttendanceStatusEnum"

@Entity()
@Unique(["gathering", "user"])
export class GatheringAttendee {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
    })
        status: GatheringAttendanceStatusEnum

    @CreateDateColumn()
        createdAt: Date

    @UpdateDateColumn()
        updatedAt: Date

    @ManyToOne(() => Gathering, gathering => gathering.attendees, { nullable: false, onDelete: "CASCADE" })
        gathering: Gathering

    @ManyToOne(() => User, user => user.gatheringAttendances, { nullable: false, onDelete: "CASCADE" })
        user: User

}
