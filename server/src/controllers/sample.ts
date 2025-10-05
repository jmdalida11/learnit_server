import type { Request, Response } from "express";

export const getSample = (req: Request, res: Response): void => {
  const samples = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  res.status(200).json(samples);
}