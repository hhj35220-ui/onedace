import { prisma } from '../config/database';
import { log } from '../config/logger';
import { ListNotificationsDto } from '../dto/notifications/list-notifications.dto';
import { UpdateNotificationDto } from '../dto/notifications/update-notification.dto';
import { AppError } from '../utils/AppError';

export class NotificationService {
  private buildResponse(data: unknown, message: string) {
    return {
      success: true,
      message,
      data
    };
  }

  async createNotification(userId: string, organizationId: string, type: string, title: string, message: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          organizationId,
          type: type as never,
          title,
          message,
          entityType,
          entityId,
          metadata: metadata as never
        }
      });

      return notification;
    } catch (error) {
      log.error('Failed to create notification', { error, userId, organizationId, type, entityType, entityId });
      throw new AppError('An unexpected error occurred while creating the notification', 500);
    }
  }

  async createBulkNotifications(items: Array<{
    userId: string;
    organizationId: string;
    type: string;
    title: string;
    message: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }>) {
    try {
      const notifications = await prisma.notification.createMany({
        data: items.map((item) => ({
          userId: item.userId,
          organizationId: item.organizationId,
          type: item.type as never,
          title: item.title,
          message: item.message,
          entityType: item.entityType,
          entityId: item.entityId,
          metadata: item.metadata as never,
          isRead: false
        }))
      });

      return notifications;
    } catch (error) {
      log.error('Failed to create bulk notifications', { error, items });
      throw new AppError('An unexpected error occurred while creating the notifications', 500);
    }
  }

  async getNotifications(userId: string, query: ListNotificationsDto) {
    try {
      const page = Math.max(1, Number(query.page ?? 1));
      const limit = Math.max(1, Math.min(100, Number(query.limit ?? 20)));
      const skip = (page - 1) * limit;

      const [notifications, total] = await prisma.$transaction([
        prisma.notification.findMany({
          where: { userId, deletedAt: null },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.notification.count({ where: { userId, deletedAt: null } })
      ]);

      return this.buildResponse({
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }, 'Notifications retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve notifications', { error, userId, query });
      throw new AppError('An unexpected error occurred while retrieving the notifications', 500);
    }
  }

  async getUnreadNotifications(userId: string, query: ListNotificationsDto) {
    try {
      const page = Math.max(1, Number(query.page ?? 1));
      const limit = Math.max(1, Math.min(100, Number(query.limit ?? 20)));
      const skip = (page - 1) * limit;

      const [notifications, total] = await prisma.$transaction([
        prisma.notification.findMany({
          where: { userId, deletedAt: null, isRead: false },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.notification.count({ where: { userId, deletedAt: null, isRead: false } })
      ]);

      return this.buildResponse({
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }, 'Unread notifications retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve unread notifications', { error, userId, query });
      throw new AppError('An unexpected error occurred while retrieving the unread notifications', 500);
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: { userId, deletedAt: null, isRead: false }
      });

      return this.buildResponse({ count }, 'Unread notification count retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve unread notification count', { error, userId });
      throw new AppError('An unexpected error occurred while retrieving the unread notification count', 500);
    }
  }

  async markRead(userId: string, notificationId: string, payload: UpdateNotificationDto) {
    try {
      const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId, deletedAt: null },
        select: { id: true }
      });

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: payload.isRead ?? true }
      });

      return this.buildResponse(updatedNotification, 'Notification marked as read successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to mark notification as read', { error, userId, notificationId });
      throw new AppError('An unexpected error occurred while marking the notification as read', 500);
    }
  }

  async markAllRead(userId: string) {
    try {
      await prisma.notification.updateMany({
        where: { userId, deletedAt: null, isRead: false },
        data: { isRead: true }
      });

      return this.buildResponse(null, 'All notifications marked as read successfully');
    } catch (error) {
      log.error('Failed to mark all notifications as read', { error, userId });
      throw new AppError('An unexpected error occurred while marking all notifications as read', 500);
    }
  }

  async deleteNotification(userId: string, notificationId: string) {
    try {
      const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId, deletedAt: null },
        select: { id: true }
      });

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: { deletedAt: new Date() }
      });

      return this.buildResponse(null, 'Notification deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete notification', { error, userId, notificationId });
      throw new AppError('An unexpected error occurred while deleting the notification', 500);
    }
  }
}
