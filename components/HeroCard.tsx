import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HeroCardProps = {
  userName: string;
  monthlyGoal: string;
};

const HeroCard: React.FC<HeroCardProps> = ({ userName, monthlyGoal }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Welcome, {userName}!</Text>
      <Text style={styles.goal}>Your Monthly Goal: {monthlyGoal}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goal: {
    fontSize: 18,
  },
});

export default HeroCard;
