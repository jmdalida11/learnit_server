import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Quiz } from "./Quiz.js";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  question: string;

  @Column("text")
  correctAnswer: string;

  @Column("simple-array", { nullable: true })
  options?: string[];

  @Column({
    type: "text",
    enum: ["multiple_choice", "multiple_answer", "true_false", "short_answer"],
    default: "multiple_choice",
  })
  type: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: "CASCADE",
    nullable: false,
  })
  quiz: Quiz;
}
