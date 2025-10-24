import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { User } from "./User.js";
import { Quiz } from "./Quiz.js";

@Entity()
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  title: string;

  @Column("text", { default: "" })
  content: string;

  @Column("simple-array", { nullable: true })
  tags: string[];

  @Column("boolean", { default: false })
  isShared: boolean;

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @OneToMany(() => Quiz, (quiz) => quiz.note)
  quizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
