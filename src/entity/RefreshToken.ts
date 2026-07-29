import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class RefreshToken {

    @PrimaryGeneratedColumn()
        id: number;

    // Wird in _generateRefreshToken() per crypto.randomUUID() gesetzt, nicht per DB-Default,
    // da PostgreSQL (uuid_generate_v4()) und MySQL hierfür keine gemeinsame Lösung anbieten.
    @Column({
        unique: true
    })
        token: string;

    @Column()
        validUntil: Date;

    @CreateDateColumn()
        lastUsed: Date;

    @Column({
        default: true
    })
        isActive: boolean;

    @CreateDateColumn({
        select: false
    })
        createdAt: Date;

    @UpdateDateColumn()
        updatedAt: Date;

    @ManyToOne(() => User, user => user.refreshTokens, { onDelete: "CASCADE" })
        user: User;
}
