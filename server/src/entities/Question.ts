import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Quiz } from "./Quiz.js";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  questionText: string;

  @Column("simple-array", { nullable: true })
  options: string[]; // for MCQs

  @Column("text", { nullable: true })
  correctAnswer: string;

  @Column("text", { default: "multiple_choice" })
  type: string; // multiple_choice | true_false | short_answer | flashcard

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: "CASCADE",
    nullable: false,
  })
  quiz: Quiz;
}
