import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm"
import { User } from "./User"

@Entity()
export class CustomBadge {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
    })
        title: string

    // Hintergrundfarbe als Hex, z. B. "#ff8800"
    @Column({
        nullable: false,
    })
        color: string

    // Textfarbe als Hex, z. B. "#ffffff"
    @Column({
        nullable: false,
    })
        textColor: string

    @CreateDateColumn()
        createdAt: Date

    @UpdateDateColumn()
        updatedAt: Date

    // CASCADE: wird ein Badge gelöscht, verschwinden auch seine Vergaben in user_custom_badge
    @ManyToMany(() => User, user => user.badges, { onDelete: "CASCADE", onUpdate: "CASCADE" })
        users: User[]

}
