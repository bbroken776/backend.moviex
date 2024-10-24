import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const authHeader = req.headers['authorization'] || 'No Authorization Header';
    const requestBody = req.method === 'POST' ? JSON.stringify(req.body) : 'No Body';
    const time = new Date().toISOString();
    
    // Prepare the log message
    const logMessage = `📌 [${time}] [${method}] >> [${originalUrl}] [Authorization: ${authHeader}]`;
    
    // Log the body only for POST requests
    if (method === 'POST') {
      console.log(`${logMessage} -> ${requestBody}`);
    } else {
      console.log(logMessage);
    }

    next();
  }
}