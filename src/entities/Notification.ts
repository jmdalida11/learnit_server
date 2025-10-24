import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User.js";

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  message: string;

  @Column("boolean", { default: false })
  read: boolean;

  @Column("datetime")
  scheduledFor: Date;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
