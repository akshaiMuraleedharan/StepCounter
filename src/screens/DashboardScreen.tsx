import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { DashboardScreenProps } from '../types/navigation';
import Value from '../components/Value';
import RingProgress from '../components/RingProgress';
import useHealthData from '../hooks/useHealthData';

const STEPS_GOAL = 10_000;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ route }) => {
  const { user } = route.params;
  const [date, setDate] = useState(new Date());
  const { steps, flights, distance, heartRate, bloodOxygen } = useHealthData(date);

  const changeDate = (numDays: number) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + numDays);
      return newDate;
    });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Health Tracker</Text> */}
      
      {/* User Info */}
      <Text style={styles.userInfo}>User ID: {user.userId || 'N/A'}</Text>
      <Text style={styles.userInfo}>Email: {user.email || 'N/A'}</Text>
      <Text style={styles.userInfo}>
        Name: {user.name?.givenName || 'N/A'} {user.name?.familyName || ''}
      </Text>

      {/* Date Picker */}
      <View style={styles.datePicker}>
        <AntDesign onPress={() => changeDate(-1)} name="left" size={24} color="#C3FF53" />
        <Text style={styles.date}>{date.toDateString()}</Text>
        <AntDesign onPress={() => changeDate(1)} name="right" size={24} color="#C3FF53" />
      </View>

      {/* Progress Ring for Steps */}
      <RingProgress radius={150} strokeWidth={50} progress={steps / STEPS_GOAL} />

      {/* Health Data Values */}
      <View style={styles.values}>
        <Value label="Steps" value={steps.toLocaleString()} />
        <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Flights Climbed" value={flights.toString()} />
        <Value label="Heart Rate" value={`${heartRate} bpm`} />
        <Value label="Blood Oxygen" value={`${bloodOxygen}%`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 16,
    color: '#C3FF53',
    marginBottom: 5,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
  },
  date: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    marginHorizontal: 16,
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 50,
  },
});

export default DashboardScreen;
