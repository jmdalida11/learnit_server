import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Quiz } from "./Quiz.js";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  questionText: string;

  @Column("simple-array", { nullable: true })
  options: string[]; // for MCQs

  @Column({ nullable: true })
  correctAnswer: string;

  @Column({ default: "multiple_choice" })
  type: string; // multiple_choice | true_false | short_answer | flashcard

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: "CASCADE" })
  quiz: Quiz;
}
