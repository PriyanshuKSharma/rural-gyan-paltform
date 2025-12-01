import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import VirtualClassListScreen from '../screens/VirtualClassListScreen';
import VirtualClassRoomScreen from '../screens/VirtualClassRoomScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import AITutorScreen from '../screens/AITutorScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="Materials" component={MaterialsScreen} />
      <Stack.Screen name="AITutor" component={AITutorScreen} />
      
      {/* Placeholders for future implementation */}
      <Stack.Screen name="CodeEditor" component={PlaceholderScreen} initialParams={{ title: 'Code Editor' }} />
      <Stack.Screen name="CreateQuiz" component={PlaceholderScreen} initialParams={{ title: 'Create Quiz' }} />
      <Stack.Screen name="Students" component={PlaceholderScreen} initialParams={{ title: 'Students' }} />
      <Stack.Screen name="Analytics" component={PlaceholderScreen} initialParams={{ title: 'Analytics' }} />
      <Stack.Screen name="Teachers" component={PlaceholderScreen} initialParams={{ title: 'Teachers' }} />
      <Stack.Screen name="Reports" component={PlaceholderScreen} initialParams={{ title: 'Reports' }} />
    </Stack.Navigator>
  );
};

const VirtualClassStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="VirtualClassList" 
        component={VirtualClassListScreen}
      />
      <Stack.Screen 
        name="VirtualClassRoom" 
        component={VirtualClassRoomScreen}
      />
      <Stack.Screen 
        name="Attendance" 
        component={AttendanceScreen}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'VirtualClass') {
            iconName = 'video-call';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="VirtualClass" 
        component={VirtualClassStack}
        options={{ title: user?.role === 'teacher' ? 'My Classes' : 'Classes' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;