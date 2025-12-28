
import { Button, Icon, Text } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { default as Habit } from '../constants/Types';

interface EditHabitModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSave: (id: string, name: string, goal: number, icon: string) => Promise<void>;
}

export default function EditHabitModal({ visible, habit, onClose, onSave }: EditHabitModalProps) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [icon, setIcon] = useState('fitness-center');

  const icons = [
    'fitness-center', 'restaurant', 'work', 'school', 
    'local-drink', 'bed', 'directions-run', 'book', 
    'code', 'music-note', 'pets', 'attach-money'
  ];

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setGoal(habit.goalAmount ? String(habit.goalAmount) : '');
      setIcon(habit.icon || 'fitness-center');
    }
  }, [habit]);

  const handleSave = () => {
    if (habit) {
      onSave(habit.id, name, Number(goal), icon);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text h4 style={{ marginBottom: 15 }}>Edit Habit</Text>
          <TextInput
            style={styles.input}
            placeholder="Habit Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Daily Value"
            value={goal}
            onChangeText={setGoal}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Select Icon:</Text>
          <View style={styles.iconContainer}>
            {icons.map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setIcon(i)}
                style={[
                  styles.iconWrapper,
                  icon === i && styles.selectedIcon,
                ]}
              >
                <Icon name={i} type="material" color={icon === i ? 'white' : '#517fa4'} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Button title="Cancel" type="outline" onPress={onClose} containerStyle={{ width: '45%' }} />
            <Button title="Save" onPress={handleSave} containerStyle={{ width: '45%' }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: "white", borderRadius: 20, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '90%' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 10, marginBottom: 15, width: '100%' },
  label: { alignSelf: 'flex-start', fontWeight: 'bold', marginBottom: 5 },
  iconContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 20 },
  iconWrapper: { padding: 8, borderRadius: 50, borderWidth: 1, borderColor: '#517fa4', margin: 4 },
  selectedIcon: { backgroundColor: '#517fa4' },
});
