export type ProjectSubscriptionClientMessage = (
  | {
    type: 'subscribe';
    projectId: number;
  } | {
    type: 'unsubscribe';
    projectId: number;
  } | {
    type: 'ping';
  }
)

export type ProjectRealtimeEventType = (
  | 'issue.created'
  | 'issue.updated'
  | 'issue.status.updated'
  | 'issue.assigned'
  | 'issue.deleted'
)

export interface ProjectRealtimeEvent<T = unknown> {
  type: ProjectRealtimeEventType;
  projectId: number;
  timestamp: string;
  data: T;
}

export interface ProjectRealtimeServerMessage<T = unknown> {
  type: 'ready' | 'subscribed' | 'unsubscribed' | 'pong' | 'event' | 'error';
  projectId?: number;
  userId?: number;
  message?: string;
  event?: ProjectRealtimeEvent<T>;
}
