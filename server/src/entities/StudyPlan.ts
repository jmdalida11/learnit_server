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

  @Column()
  subject: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("date")
  scheduledDate: Date;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.studyPlans, { onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
