export default interface UserProfile {
  uid?: string;
  displayName: string;
  email: string;
  currency: string;      // e.g., "$"
  goalHistory: Record<string, GoalDetails>;  // e.g., 2000
  createdAt?: any;        // Firebase Timestamp
  profileImage?: string; // Optional field
}
export default interface Habit {
  id: string;
  name: string;
  icon: string;
  goalAmount: number;  // How much is "saved" per completion
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // e.g., "2025-01-23"
}


export default interface habitLogs {
  habitId: string;
  valueSaved: number;
  date: any; // Firebase Timestamp
  
}
 interface GoalDetails {
  achieved: number;
  status: 'closed' | 'in-progress' | 'failed'; // Union type for better strictness
  target: number;
}
