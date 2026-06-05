import {
  Injectable,
  OnModuleDestroy,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import {
  ProjectRealtimeEvent,
  ProjectRealtimeServerMessage,
  ProjectSubscriptionClientMessage,
} from './project-realtime.types';

interface ProjectSocketContext {
  userId: number;
  projects: Set<number>;
}

@Injectable()
export class ProjectRealtimeService implements OnModuleDestroy {
  private server: WebSocketServer | null = null;
  private readonly sockets = new Map<WebSocket, ProjectSocketContext>();
  private readonly projectSubscribers = new Map<number, Set<WebSocket>>();
  private readonly projectPresence = new Map<number, Map<number, number>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  attachServer(server: WebSocketServer) {
    this.server = server;
    server.on('connection', (socket, request) => {
      void this.handleConnection(socket, request);
    });
  }

  onModuleDestroy() {
    this.server?.close();
  }

  async handleConnection(socket: WebSocket, request: IncomingMessage) {
    try {
      const userId = await this.authenticateRequest(request);
      this.sockets.set(socket, {
        userId,
        projects: new Set<number>(),
      });

      this.send(socket, {
        type: 'ready',
        userId,
      });

      socket.on('message', (data) => {
        const rawMessage = Buffer.isBuffer(data)
          ? data.toString('utf8')
          : Array.isArray(data)
            ? Buffer.concat(data).toString('utf8')
            : Buffer.from(data as ArrayBufferLike).toString('utf8');

        void this.handleMessage(socket, rawMessage);
      });

      socket.on('close', () => {
        this.cleanupSocket(socket);
      });

      socket.on('error', () => {
        this.cleanupSocket(socket);
      });
    } catch (error) {
      this.sendError(socket, error);
      socket.close(4401, 'Unauthorized');
    }
  }

  emitProjectEvent<T>(projectId: number, event: ProjectRealtimeEvent<T>) {
    const subscribers = this.projectSubscribers.get(projectId);

    if (!subscribers || subscribers.size === 0) {
      return;
    }

    for (const socket of subscribers) {
      this.send(socket, {
        type: 'event',
        projectId,
        event,
      });
    }
  }

  emitIssueCreated(projectId: number, data: unknown) {
    this.emitProjectEvent(projectId, {
      type: 'issue.created',
      projectId,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  emitIssueUpdated(projectId: number, data: unknown) {
    this.emitProjectEvent(projectId, {
      type: 'issue.updated',
      projectId,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  emitIssueStatusUpdated(projectId: number, data: unknown) {
    this.emitProjectEvent(projectId, {
      type: 'issue.status.updated',
      projectId,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  emitIssueAssigned(projectId: number, data: unknown) {
    this.emitProjectEvent(projectId, {
      type: 'issue.assigned',
      projectId,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  emitIssueDeleted(projectId: number, data: unknown) {
    this.emitProjectEvent(projectId, {
      type: 'issue.deleted',
      projectId,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  private async handleMessage(
    socket: WebSocket,
    rawMessage: string,
  ): Promise<void> {
    const context = this.sockets.get(socket);
    if (!context) {
      return;
    }

    let message: ProjectSubscriptionClientMessage;

    try {
      message = JSON.parse(rawMessage) as ProjectSubscriptionClientMessage;
    } catch {
      this.send(socket, {
        type: 'error',
        message: 'Invalid JSON message',
      });
      return;
    }

    if (message.type === 'ping') {
      this.send(socket, { type: 'pong' });
      return;
    }

    if (message.type === 'subscribe') {
      await this.subscribe(socket, context.userId, message.projectId);
      return;
    }

    if (message.type === 'unsubscribe') {
      this.unsubscribe(socket, message.projectId);
    }
  }

  private async subscribe(
    socket: WebSocket,
    userId: number,
    projectId: number,
  ) {
    const membership = await this.prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      select: {
        userId: true,
        projectId: true,
      },
    });

    if (!membership) {
      this.send(socket, {
        type: 'error',
        message: 'You are not a member of this project',
        projectId,
      });
      return;
    }

    const context = this.sockets.get(socket);
    if (!context) {
      return;
    }

    context.projects.add(projectId);

    const subscribers =
      this.projectSubscribers.get(projectId) ?? new Set<WebSocket>();
    subscribers.add(socket);
    this.projectSubscribers.set(projectId, subscribers);

    this.incrementPresence(projectId, userId);
    this.broadcastPresence(projectId);

    this.send(socket, {
      type: 'subscribed',
      projectId,
    });
  }

  private unsubscribe(socket: WebSocket, projectId: number) {
    const context = this.sockets.get(socket);
    if (!context) {
      return;
    }

    context.projects.delete(projectId);
    const subscribers = this.projectSubscribers.get(projectId);
    subscribers?.delete(socket);

    if (subscribers && subscribers.size === 0) {
      this.projectSubscribers.delete(projectId);
    }

    this.decrementPresence(projectId, context.userId);
    this.broadcastPresence(projectId);

    this.send(socket, {
      type: 'unsubscribed',
      projectId,
    });
  }

  private cleanupSocket(socket: WebSocket) {
    const context = this.sockets.get(socket);
    if (!context) {
      return;
    }

    for (const projectId of context.projects) {
      const subscribers = this.projectSubscribers.get(projectId);
      subscribers?.delete(socket);

      if (subscribers && subscribers.size === 0) {
        this.projectSubscribers.delete(projectId);
      }

      this.decrementPresence(projectId, context.userId);
      this.broadcastPresence(projectId);
    }

    this.sockets.delete(socket);
  }

  private incrementPresence(projectId: number, userId: number) {
    const projectPresence =
      this.projectPresence.get(projectId) ?? new Map<number, number>();
    const nextCount = (projectPresence.get(userId) ?? 0) + 1;
    projectPresence.set(userId, nextCount);
    this.projectPresence.set(projectId, projectPresence);
  }

  private decrementPresence(projectId: number, userId: number) {
    const projectPresence = this.projectPresence.get(projectId);
    if (!projectPresence) {
      return;
    }

    const currentCount = projectPresence.get(userId) ?? 0;
    if (currentCount <= 1) {
      projectPresence.delete(userId);
    } else {
      projectPresence.set(userId, currentCount - 1);
    }

    if (projectPresence.size === 0) {
      this.projectPresence.delete(projectId);
    }
  }

  private broadcastPresence(projectId: number) {
    const subscribers = this.projectSubscribers.get(projectId);
    if (!subscribers || subscribers.size === 0) {
      return;
    }

    const onlineUserIds = Array.from(
      this.projectPresence.get(projectId)?.keys() ?? [],
    );

    for (const socket of subscribers) {
      this.send(socket, {
        type: 'presence.snapshot',
        projectId,
        onlineUserIds,
      });
    }
  }

  private send<T>(socket: WebSocket, message: ProjectRealtimeServerMessage<T>) {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify(message));
  }

  private sendError(socket: WebSocket, error: unknown) {
    const message =
      error instanceof UnauthorizedException
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Unauthorized';

    this.send(socket, {
      type: 'error',
      message,
    });
  }

  private async authenticateRequest(request: IncomingMessage) {
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing websocket auth token');
    }

    const payload = await this.jwtService.verifyAsync<{ sub: number }>(token);
    return payload.sub;
  }

  private extractToken(request: IncomingMessage) {
    const authorization = request.headers.authorization;
    if (authorization?.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length);
    }

    const requestUrl = request.url
      ? new URL(request.url, 'http://localhost')
      : null;
    const queryToken = requestUrl?.searchParams.get('token');
    if (queryToken) {
      return queryToken;
    }

    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return null;
    }

    for (const cookie of cookieHeader.split(';')) {
      const [rawKey, ...rawValue] = cookie.trim().split('=');
      if (rawKey === 'token') {
        return rawValue.join('=');
      }
    }

    return null;
  }
}
