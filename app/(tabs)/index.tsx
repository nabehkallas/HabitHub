import { getMonthlySavings } from '@/components/GetMonthlySavings';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, CheckBox, FAB, Icon, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import EditHabitModal from '../../components/EditHabitModal';
import GoalPromptModal from '../../components/GoalPromptModal';
import HabitDetailsModal from '../../components/HabitDetailsModal';
import HeroCard from '../../components/HeroCard';
import { default as Habit, default as UserProfile } from '../../constants/Types';
import { useAuth } from '../../context/AuthContext';
import { auth, db } from '../../firebase';


export default function Index() {
  const router = useRouter();
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [viewingHabit, setViewingHabit] = useState<Habit | null>(null);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [currentGoalAmount, setCurrentGoalAmount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

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
          
          // Check for current month's goal
          const data = docSnap.data() as UserProfile;
          const now = new Date();
          // Create a key like "2023-10"
          const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
          const currentGoal = data.goalHistory ? data.goalHistory[currentMonthKey] : null;

          if (currentGoal) {
            setCurrentGoalAmount(currentGoal.target);
          }
          if (!currentGoal || currentGoal.status !== 'in-progress') {
            setGoalModalVisible(true);
          }
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      });

      getMonthlySavings(user).then((savings) => {
        setMonthlySavings(savings);
        console.log('Monthly Savings: ' + savings);
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
      <View style={{flex: 1}}>
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
        getMonthlySavings(user).then(setMonthlySavings);
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
    getMonthlySavings(user).then(setMonthlySavings);
  };

  const isHabitCompletedToday = (habit: any) => {
    if (!habit.lastCompletedDate) return false;
    const today = new Date();
    const last = habit.lastCompletedDate.toDate();
    return last.getDate() === today.getDate() &&
           last.getMonth() === today.getMonth() &&
           last.getFullYear() === today.getFullYear();
  };

  const handleDeleteHabit = (habitId: string) => {
    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "users", user!.uid, "habits", habitId));
        },
      },
    ]);
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setEditModalVisible(true);
  };

  const openDetailsModal = (habit: Habit) => {
    setViewingHabit(habit);
    setDetailsModalVisible(true);
  };

  const handleSaveEdit = async (id: string, name: string, goal: number, icon: string) => {
    if (!user) return;
    try {
      const habitRef = doc(db, "users", user.uid, "habits", id);
      await updateDoc(habitRef, {
        name: name,
        goalAmount: goal,
        icon: icon
      });
      setEditModalVisible(false);
      setEditingHabit(null);
    } catch (e) {
      Alert.alert("Error", "Could not update habit");
    }
  };

  const handleSetGoal = async (amount: number) => {
    if (!user) return;
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const newGoal = {
      target: amount,
      achieved: 0,
      status: 'in-progress'
    };

    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`goalHistory.${currentMonthKey}`]: newGoal
      });
      setGoalModalVisible(false);
    } catch (error) {
      console.error("Error setting goal:", error);
      Alert.alert("Error", "Failed to set goal.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/HabitHub_Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.profileIcon}>
          <Icon name="account-circle" type="material" size={35} color="#517fa4" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.dropdown}>
          <View style={styles.dropdownItem}>
            <Text style={styles.dropdownTitle}>Profile Info</Text>
            <Text style={styles.dropdownText}>{userData?.displayName || 'User'}</Text>
            <Text style={styles.dropdownSubText}>{userData?.email || user?.email}</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuVisible(false); Alert.alert('History', 'History feature coming soon.'); }}>
            <Text>History</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuVisible(false); handleLogout(); }}>
            <Text style={{ color: 'red' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contentContainer}>
      <SwipeListView
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          userData ? (
            <HeroCard
              userName={userData.displayName}
              monthlyGoal={currentGoalAmount}
              savings={monthlySavings}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} onLongPress={() => openDetailsModal(item)}>
          <Card containerStyle={{ width: '90%', borderRadius: 10, alignSelf: 'center', marginVertical: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Icon name={item.icon || "fitness-center"} type="material" color="#517fa4" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: 'gray' }}>Streak: {item.currentStreak || 0} | Value: {item.goalAmount || 0}</Text>
                </View>
              </View>
              <CheckBox
                checked={isHabitCompletedToday(item)}
                onPress={() => handleCheckHabit(item)}
                containerStyle={{ padding: 0, margin: 0 }}
              />
            </View>
          </Card>
          </TouchableOpacity>
        )}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[styles.backBtn, styles.backLeftBtn]}
              onPress={() => openEditModal(data.item)}
            >
              <Icon name="edit" type="material" color="white" />
              <Icon name="arrow-forward" type="material" color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backBtn, styles.backRightBtn]}
              onPress={() => handleDeleteHabit(data.item.id)}
            >
              <Icon name="arrow-back" type="material" color="white" size={20} />
              <Icon name="delete" type="material" color="white" />
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
        disableRightSwipe={false}
        disableLeftSwipe={false}
      />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 HabitHub Inc.</Text>
        <Text style={styles.footerText}>made by Eng.Nameh kallas</Text>
      </View>

      <FAB
        placement="right"
        color="#517fa4"
        icon={<MaterialIcons name="add" size={24} color="white" />}
        onPress={() => router.push('/add-habit')}
      />
      <EditHabitModal
        visible={editModalVisible}
        habit={editingHabit}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
      />
      <HabitDetailsModal
        visible={detailsModalVisible}
        habit={viewingHabit}
        onClose={() => setDetailsModalVisible(false)}
      />
      <GoalPromptModal
        visible={goalModalVisible}
        onSave={handleSetGoal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  backBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    flexDirection: 'row',
  },
  backLeftBtn: {
    backgroundColor: '#4CAF50',
    left: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  backRightBtn: {
    backgroundColor: '#F44336',
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 40,
  },
  profileIcon: {
    padding: 5,
  },
  dropdown: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dropdownTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  dropdownText: { fontSize: 14 },
  dropdownSubText: { fontSize: 12, color: 'gray' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 2 },
  footer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});
