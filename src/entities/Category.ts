import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Index,
} from "typeorm";
import { User } from "./User.js";
import { Quiz } from "./Quiz.js";

@Entity()
@Index(["user", "name"], { unique: true })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  name: string;

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @ManyToMany(() => Quiz, (quiz) => quiz.categories)
  @JoinTable()
  quizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
