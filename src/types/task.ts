export enum Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  ALL = "All",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  isCompleted: boolean;
}
