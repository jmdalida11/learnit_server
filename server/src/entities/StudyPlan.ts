import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User.js";

@Entity()
export class StudyPlan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  subject: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("date")
  scheduledDate: Date;

  @Column("boolean", { default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.studyPlans, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
