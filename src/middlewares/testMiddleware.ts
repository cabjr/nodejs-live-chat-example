import { Router, Request, Response } from 'express';

module.exports = (req: Request, res: Response, next: () => void) => {
    next();
    
};
  