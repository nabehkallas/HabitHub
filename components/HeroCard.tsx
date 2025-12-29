import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PieChart from './PieChart';


type HeroCardProps = {
  userName: string;
  monthlyGoal: number;
  savings: number;
};

const HeroCard: React.FC<HeroCardProps> = ({ userName, monthlyGoal, savings }) => {
  return (
    <View style={styles.card}>
      <PieChart monthlyGoal={monthlyGoal}
              savings={savings} />
              
      <Text style={styles.title}>Welcome, {userName}!</Text>
      <Text style={styles.goal}>Your Monthly Goal: {monthlyGoal}</Text>
      <Text style={styles.goal}>Saved : {savings}</Text>
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
