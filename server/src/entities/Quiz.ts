import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User.js";
import { Note } from "./Note.js";
import { Question } from "./Question.js";

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  title: string;

  @ManyToOne(() => User, (user) => user.quizzes, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Note, (note) => note.quizzes, {
    nullable: true,
    onDelete: "SET NULL",
  })
  note: Note;

  @OneToMany(() => Question, (q) => q.quiz, { cascade: true })
  questions: Question[];

  @Column("int", { default: 0 })
  attempts: number;

  @Column("decimal", { default: 0 })
  averageScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
