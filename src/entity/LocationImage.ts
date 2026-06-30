import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Location } from "./Location";

@Entity()
export class LocationImage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  filename: string;

  @Column({
    nullable: false,
  })
  url: string;

  @Column({
    nullable: true,
  })
  altText: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Location, (location) => location.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "locationId" })
  location: Location;

  @Column()
  locationId: number;
}