export const TASK_EVENTS = {
  CREATED: 'task.created',
  UPDATED: 'task.updated',
  DELETED: 'task.deleted',
  ASSIGNED: 'task.assigned',
  COMPLETED: 'task.completed',
  STATUS_CHANGED: 'task.statusChanged'
};

export const COMMENT_EVENTS = {
  CREATED: 'comment.created',
  UPDATED: 'comment.updated',
  DELETED: 'comment.deleted'
};

export const CHECKLIST_EVENTS = {
  UPDATED: 'checklist.updated',
  ITEM_UPDATED: 'checklistItem.updated'
};

export const ATTACHMENT_EVENTS = {
  UPLOADED: 'attachment.uploaded',
  DELETED: 'attachment.deleted'
};

export const NOTIFICATION_EVENTS = {
  CREATED: 'notification.created',
  READ: 'notification.read'
};

export const PRESENCE_EVENTS = {
  ONLINE: 'user.online',
  OFFLINE: 'user.offline',
  TYPING: 'user.typing',
  STOP_TYPING: 'user.stopTyping'
};
