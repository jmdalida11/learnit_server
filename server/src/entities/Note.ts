import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User.js";
import { Quiz } from "./Quiz.js";

@Entity()
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column("simple-array", { nullable: true })
  tags: string[];

  @Column({ default: false })
  isShared: boolean;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Quiz, (quiz) => quiz.note)
  quizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
