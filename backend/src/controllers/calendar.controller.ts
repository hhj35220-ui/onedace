import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ConnectCalendarDto } from '../dto/calendar/connect-calendar.dto';
import { CalendarSyncDto } from '../dto/calendar/calendar-sync.dto';
import { CalendarService } from '../services/calendar.service';
import { AppError } from '../utils/AppError';
import { connectCalendarSchema, syncCalendarSchema } from '../validators/calendar.validator';

export class CalendarController {
  private readonly calendarService: CalendarService;

  constructor(calendarService = new CalendarService()) {
    this.calendarService = calendarService;
  }

  async connect(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = connectCalendarSchema.parse(req.body) as ConnectCalendarDto;
      const result = await this.calendarService.connectCalendar(req.user.id, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async disconnect(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const result = await this.calendarService.disconnectCalendar(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const result = await this.calendarService.getCalendarStatus(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async sync(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = syncCalendarSchema.parse(req.body) as CalendarSyncDto;
      const result = await this.calendarService.syncTasks(req.user.id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async exportIcs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const ics = await this.calendarService.generateICS(req.user.id);
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"');
      res.status(200).send(ics);
    } catch (error) {
      return next(error);
    }
  }
}
