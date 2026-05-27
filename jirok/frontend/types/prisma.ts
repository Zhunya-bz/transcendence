export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

export enum IssueStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum IssueType {
  BUG = "BUG",
  TASK = "TASK",
  STORY = "STORY",
}

export enum AttachmentEntityType {
  ISSUE = "ISSUE",
  COMMENT = "COMMENT",
}

export enum NotificationEntityType {
  ISSUE = "ISSUE",
  COMMENT = "COMMENT",
  PROJECT = "PROJECT",
}

export interface User {
  id: number;
  name: string;
  surname?: string | null;
  email: string;
  passwordHash?: string;
  picture?: {
    medium?: string | null;
  } | null;
  jobTitle?: string | null;
  jobOrganization?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  accountCreated?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  projects?: UserProject[];
  comments?: Comment[];
  attachments?: Attachment[];
  apiKeys?: ApiKey[];
  reportedIssues?: Issue[];
  assignedIssues?: Issue[];
  changedIssues?: Issue[];
  notifications?: Notification[];
  triggeredNotifications?: Notification[];
}

export interface Project {
  id: number;
  name: string;
  projectKey: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  members?: UserProject[];
  issues?: Issue[];
}

export interface UserProject {
  userId: number;
  projectId: number;
  role: UserRole;
  joinedAt?: string;
  user?: User;
  project?: Project;
}

export interface Issue {
  id: number;
  projectId: number;
  reporterId: number;
  assigneeId?: number | null;
  changedUserId?: number | null;
  status: IssueStatus;
  type: IssueType;
  title: string;
  description?: string | null;
  priority: IssuePriority;
  created?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  project?: Project;
  reporter?: User;
  assignee?: User | null;
  changedUser?: User | null;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  issueId: number;
  authorId: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  issue?: Issue;
  author?: User;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileSize: number;
  storagePath: string;
  uploadedById: number;
  entityType: AttachmentEntityType;
  entityId: number;
  createdAt?: string;
  updatedAt?: string;
  uploader?: User;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message?: string | null;
  entityType: NotificationEntityType;
  entityId?: number | null;
  triggeredByUserId?: number | null;
  eventType: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt?: string;
  user?: User;
  triggeredByUser?: User | null;
}

export interface ApiKey {
  id: number;
  userId: number;
  keyHash: string;
  createdAt?: string | null;
  user?: User;
}

export type MemberPayload = {
  email: string;
  role?: UserRole;
};