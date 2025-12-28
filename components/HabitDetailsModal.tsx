
import { Button, Icon, Text } from '@rneui/themed';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { default as Habit } from '../constants/Types';

interface HabitDetailsModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
}

export default function HabitDetailsModal({ visible, habit, onClose }: HabitDetailsModalProps) {
  if (!habit) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
             <Icon name={habit.icon || "fitness-center"} type="material" color="#517fa4" size={50} />
             <Text h3 style={styles.title}>{habit.name}</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Value (Goal):</Text>
            <Text style={styles.value}>{habit.goalAmount}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Current Streak:</Text>
            <Text style={styles.value}>{habit.currentStreak}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Longest Streak:</Text>
            <Text style={styles.value}>{habit.longestStreak}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Completed:</Text>
            <Text style={styles.value}>{formatDate(habit.lastCompletedDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Created At:</Text>
            <Text style={styles.value}>{formatDate(habit.createdAt)}</Text>
          </View>

          <Button title="Close" onPress={onClose} containerStyle={{ marginTop: 20, width: '100%' }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: "white", borderRadius: 20, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '85%' },
  header: { alignItems: 'center', marginBottom: 10 },
  title: { marginTop: 10, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#ddd', width: '100%', marginVertical: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, width: '100%' },
  label: { fontWeight: 'bold', fontSize: 16, color: '#555' },
  value: { fontSize: 16, color: '#000' },
});
