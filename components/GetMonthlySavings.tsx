import { collection, getAggregateFromServer, query, sum, where } from "firebase/firestore";
import { db } from '../firebase';

export const getMonthlySavings = async (user: any) => {
  // 1. Define the time range (Start of Current Month)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  try {
    // 2. Reference the specific user's sub-collection
    const logsRef = collection(db, "users", user.uid, "habitLogs");

    // 3. Create the query
    const q = query(
      logsRef,
       where("date", ">=", startOfMonth)
    );
    // 4. Run the Aggregation
    const snapshot = await getAggregateFromServer(q, {
      totalSaved: sum("valueSaved")
    });

    return snapshot.data().totalSaved || 0;
  } catch (error) {
    console.error("Error calculating savings:", error);
    return 0;
  }
};