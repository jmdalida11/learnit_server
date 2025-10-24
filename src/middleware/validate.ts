import z, { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          issues: err.issues,
        });
      }
      next(err);
    }
  };
}

export function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = schema.parse(req.params);
      req.params = parsedParams as typeof req.params;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid params", issues: err.issues });
      }
      return next(err);
    }
  };
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedQuery = schema.parse(req.query);
      req.query = parsedQuery as typeof req.query;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid query", issues: err.issues });
      }
      next(err);
    }
  };
}
