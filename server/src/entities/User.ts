import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Note } from "./Note.js";
import { Quiz } from "./Quiz.js";
import { StudyPlan } from "./StudyPlan.js";
import { Notification } from "./Notification.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255, unique: true })
  username: string;

  @Column("varchar")
  password: string;

  @Column("varchar")
  salt: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("boolean", { default: false })
  verified: boolean;

  @Column("varchar", { length: 100 })
  name: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quizzes: Quiz[];

  @OneToMany(() => StudyPlan, (plan) => plan.user)
  studyPlans: StudyPlan[];

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
