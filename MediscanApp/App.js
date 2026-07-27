import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ScanMedicineScreen from './src/screens/ScanMedicineScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import MedicalRecordsScreen from './src/screens/MedicalRecordsScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import EmergencyQRScreen from './src/screens/EmergencyQRScreen';
import BloodRequestsScreen from './src/screens/BloodRequestsScreen';
import PrescriptionScanScreen from './src/screens/PrescriptionScanScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ScanMedicine" component={ScanMedicineScreen} />
      <Stack.Screen name="PrescriptionScan" component={PrescriptionScanScreen} />
      <Stack.Screen name="EmergencyQR" component={EmergencyQRScreen} />
      <Stack.Screen name="BloodRequests" component={BloodRequestsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Reminders') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Records') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home', headerShown: false }} />
        <Tab.Screen name="Reminders" component={RemindersScreen} />
        <Tab.Screen name="Records" component={MedicalRecordsScreen} />
        <Tab.Screen name="Chat" component={ChatbotScreen} options={{ title: 'MediBot' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}