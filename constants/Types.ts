export default interface UserProfile {
  uid?: string;
  displayName: string;
  email: string;
  currency: string;      // e.g., "$"
  monthlyGoal: number;   // e.g., 2000
  createdAt?: any;        // Firebase Timestamp
  profileImage?: string; // Optional field
}
export default interface Habit {
  id: string;
  name: string;
  icon: string;
  goalAmount: number;  // How much is "saved" per completion
  longestStreak: number;
  lastCompletedDate: string | null; // e.g., "2025-01-23"
}

export default interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  date: any; // Firebase Timestamp
  note?: string;
}
export default interface habitLogs {
  habitId: string;
  valueSaved: number;
  date: any; // Firebase Timestamp
  
}