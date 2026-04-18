import { Quiz } from "@entities/Quiz.js";
import { Question } from "@entities/Question.js";
import { User } from "@entities/User.js";
import { AuthenticatedRequest } from "@middleware/auth.js";
import type { Response } from "express";
import { CreateQuizDTO, UpdateQuizDTO } from "@validations/quiz.js";

export const getAllUserQuizzes = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const quizzes = await Quiz.find({
      where: { user: { id: req.session.user?.id ?? "" } },
      order: { updatedAt: "DESC" },
      relations: ["note", "questions", "categories"],
    });

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving quizzes for the user." });
  }
};

export const getQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quizId = req.params["id"];

    const quiz = await Quiz.createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.questions", "questions")
      .leftJoinAndSelect("quiz.note", "note")
      .leftJoinAndSelect("quiz.categories", "categories")
      .innerJoin("quiz.user", "user")
      .where("quiz.id = :quizId", { quizId })
      .andWhere("user.id = :userId", { userId: req.session.user?.id })
      .getOne();

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found for the user." });
      return;
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the quiz." });
  }
};

export const createQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, questions = [] } = req.body as CreateQuizDTO;

    const user = await User.createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id: req.session.user?.id })
      .getOne();

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const newQuiz = await Quiz.save(
      Quiz.create({
        title,
        user,
      }),
    );

    if (questions.length > 0) {
      const questionEntities = questions.map((q) => {
        const question = new Question();
        question.question = q.question;
        question.type = q.type;
        question.correctAnswer = q.correctAnswer;
        question.quiz = newQuiz;
        if (q.options) question.options = q.options;
        return question;
      });

      await Question.save(questionEntities);
    }

    res
      .status(200)
      .json({ message: "Quiz created successfully.", id: newQuiz.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating a quiz" });
  }
};

export const updateQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quizId = req.params["id"];
    const { title } = req.body as UpdateQuizDTO;

    const quiz = await Quiz.createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.user", "user")
      .where("quiz.id = :quizId", { quizId })
      .andWhere("user.id = :userId", { userId: req.session.user?.id })
      .getOne();

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found." });
      return;
    }

    quiz.title = title || quiz.title;

    const updatedQuiz = await Quiz.save(quiz);
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error updating the quiz." });
  }
};

export const deleteQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quizId = req.params["id"];

    const quiz = await Quiz.createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.user", "user")
      .where("quiz.id = :quizId", { quizId })
      .andWhere("user.id = :userId", { userId: req.session.user?.id })
      .getOne();

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found." });
      return;
    }

    await Quiz.remove(quiz);
    res.status(200).json({ message: "Quiz deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the quiz." });
  }
};
