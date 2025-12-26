import { Card, CheckBox, Icon, Text } from '@rneui/themed';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, View } from 'react-native';
import HeroCard from '../../components/HeroCard';
import { default as Habit, default as UserProfile } from '../../constants/Types';
import { useAuth } from '../../context/AuthContext';
import { auth, db } from '../../firebase';


export default function Index() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(user);
  const handleLogout = () => {
    auth.signOut().then(() => {
      Alert.alert('Logged out');
    });
  };


  useEffect(() => {
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
      const habitsRef = collection(db, "users", user.uid, "habits");

      const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserProfile);
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      });

     const unsubscribeHabits = onSnapshot(habitsRef, (snapshot) => {
        const habitsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHabits(habitsData as unknown as Habit[]);

        // Check for streak resets
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        habitsData.forEach(async (habit: any) => {
          if (habit.lastCompletedDate) {
            const lastDate = habit.lastCompletedDate.toDate();
            lastDate.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 2 && habit.currentStreak > 0) {
               const habitRef = doc(db, "users", user.uid, "habits", habit.id);
               await updateDoc(habitRef, { currentStreak: 0 });
            }
          }
        });
        console.log("Habits data:", habitsData);
      });

      return () => {
        unsubscribeUser();
        unsubscribeHabits();
      };

    } else {
      // If user is null, stop loading
      setLoading(false);
    }
  }, [user]);
   

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleCheckHabit = async (habit: any) => {
    if (!user) return;
    const today = new Date();
    const lastCompleted = habit.lastCompletedDate ? habit.lastCompletedDate.toDate() : null;
    const isCompletedToday = lastCompleted && 
        lastCompleted.getDate() === today.getDate() &&
        lastCompleted.getMonth() === today.getMonth() &&
        lastCompleted.getFullYear() === today.getFullYear();

    const habitRef = doc(db, "users", user.uid, "habits", habit.id);

    if (isCompletedToday) {
      // Uncheck Logic
      try {
        const logsRef = collection(db, "users", user.uid, "habitLogs");
        
        // 1. Find and delete today's log(s)
        today.setHours(0, 0, 0, 0);
        const qToday = query(
          logsRef,
          where("habitId", "==", habit.id),
          where("date", ">=", Timestamp.fromDate(today)),
          orderBy("date", "desc")
        );
        
        const snapshotToday = await getDocs(qToday);
        const deletePromises = snapshotToday.docs.map((logDoc) => deleteDoc(logDoc.ref));
        await Promise.all(deletePromises);

        // 2. Find the last log to update lastCompletedDate
        const qLast = query(
          logsRef,
          where("habitId", "==", habit.id),
          orderBy("date", "desc"),
          limit(1)
        );
        
        const snapshotLast = await getDocs(qLast);
        const lastLog = snapshotLast.docs[0]?.data();
        const lastCompletedDate = lastLog ? lastLog.date : null;

        // 3. Update habit doc
        const newCurrentStreak = Math.max(0, (habit.currentStreak || 0) - 1);
        
        await updateDoc(habitRef, {
          lastCompletedDate: lastCompletedDate,
          currentStreak: newCurrentStreak
        });
      } catch (error) {
        console.error("Error unchecking habit:", error);
        Alert.alert("Error", "Failed to uncheck habit. Check console for missing index.");
      }
      return;
    }

    const newCurrentStreak = (habit.currentStreak || 0) + 1;
    const newLongestStreak = newCurrentStreak > (habit.longestStreak || 0) ? newCurrentStreak : (habit.longestStreak || 0);

    await updateDoc(habitRef, {
      lastCompletedDate: Timestamp.now(),
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak
    });

    await addDoc(collection(db, "users", user.uid, "habitLogs"), {
      habitId: habit.id,
      valueSaved: habit.goalAmount || 0,
      date: Timestamp.now(),
    });
  };

  const isHabitCompletedToday = (habit: any) => {
    if (!habit.lastCompletedDate) return false;
    const today = new Date();
    const last = habit.lastCompletedDate.toDate();
    return last.getDate() === today.getDate() &&
           last.getMonth() === today.getMonth() &&
           last.getFullYear() === today.getFullYear();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          userData ? (
            <HeroCard
              userName={userData.displayName}
              monthlyGoal={userData.monthlyGoal.toString()}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <Card containerStyle={{ width: '90%', borderRadius: 10, alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name={item.icon || "fitness-center"} type="material" color="#517fa4" />
                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
              </View>
              <CheckBox
                checked={isHabitCompletedToday(item)}
                onPress={() => handleCheckHabit(item)}
                containerStyle={{ padding: 0, margin: 0 }}
              />
            </View>
          </Card>
        )}
        ListFooterComponent={<Button title="Logout" onPress={handleLogout} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
