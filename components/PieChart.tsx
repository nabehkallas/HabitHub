import React from 'react';
import { View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
type PieChartProps = {
  monthlyGoal: number;
  savings: number;
};
const PieChart: React.FC<PieChartProps> = ({ monthlyGoal, savings }) => {
    
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center',marginVertical:20 }}>
 <CircularProgress
  value={savings}
  maxValue={monthlyGoal}
  radius={120}
  progressValueColor={'#a4a4a4ff'}
  activeStrokeColor={'#2874af'}
  inActiveStrokeColor={'#ffffffff'}
  inActiveStrokeOpacity={0.8}        
  inActiveStrokeWidth={40}
  activeStrokeWidth={20}       
  valueSuffix={''}             
  progressValueStyle={{  width: 200, textAlign: 'center' }} 
  onAnimationComplete={() => {}}
/>
    </View>
  )
}
export default PieChart;