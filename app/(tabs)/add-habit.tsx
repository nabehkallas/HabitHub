import { Button, Icon, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';

export default function AddHabit() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('fitness-center');
  const [loading, setLoading] = useState(false);

  const icons = [
    'fitness-center', 'restaurant', 'work', 'school', 
    'local-drink', 'bed', 'directions-run', 'book', 
    'code', 'music-note', 'pets', 'attach-money'
  ];

  const handleAddHabit = async () => {
    if (!name || !goalAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'habits'), {
        name,
        goalAmount: Number(goalAmount),
        icon: selectedIcon,
        createdAt: Timestamp.now(),
        currentStreak: 0,
        longestStreak: 0,
      });
      setLoading(false);
      router.back();
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Error', 'Failed to add habit');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={styles.title}>New Habit</Text>
      
      <TextInput
        placeholder="Habit Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Daily Value"
        value={goalAmount}
        onChangeText={setGoalAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Select Icon:</Text>
      <View style={styles.iconContainer}>
        {icons.map((icon) => (
          <TouchableOpacity
            key={icon}
            onPress={() => setSelectedIcon(icon)}
            style={[
              styles.iconWrapper,
              selectedIcon === icon && styles.selectedIcon,
            ]}
          >
            <Icon name={icon} type="material" color={selectedIcon === icon ? 'white' : '#517fa4'} />
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Add Habit" onPress={handleAddHabit} loading={loading} containerStyle={styles.button} />
      <Button title="Cancel" type="outline" onPress={() => router.back()} containerStyle={styles.button} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#517fa4',
    margin: 5,
  },
  selectedIcon: {
    backgroundColor: '#517fa4',
  },
  button: {
    marginTop: 10,
  },
});