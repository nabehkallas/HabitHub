import { Card, Icon, Text } from '@rneui/themed';
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserProfile from '../../constants/Types';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';

interface HistoryItem {
  month: string;
  achieved: number;
  target: number;
  status: 'closed' | 'in-progress' | 'failed';
}

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          if (data?.goalHistory) {
            const historyList = Object.entries(data.goalHistory).map(([key, value]) => ({
              month: key,
              ...value,
            }));
           
            historyList.sort((a, b) => b.month.localeCompare(a.month));
            setHistory(historyList);
          } else {
            setHistory([]);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#517fa4" />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return '#4CAF50'; // Green
      case 'failed': return '#F44336'; // Red
      case 'in-progress': return '#2196F3'; // Blue
      default: return 'gray';
    }
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('default', { year: 'numeric', month: 'long' });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history available yet.</Text>
        </View>
      ) : (
        <FlatList
            data={history}
            keyExtractor={(item) => item.month}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
            <Card containerStyle={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.monthText}>{formatMonth(item.month)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Target</Text>
                        <Text style={styles.statValue}>{item.target}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Achieved</Text>
                        <Text style={styles.statValue}>{item.achieved}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Result</Text>
                         <Icon 
                            name={item.achieved >= item.target ? "check-circle" : "cancel"} 
                            type="material" 
                            color={item.achieved >= item.target ? "#4CAF50" : "#F44336"} 
                            size={24}
                        />
                    </View>
                </View>
            </Card>
            )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  }
});
