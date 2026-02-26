import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../state/hooks';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { JobListScreen } from '../screens/jobs/JobListScreen';
import { JobDetailScreen } from '../screens/jobs/JobDetailScreen';
import { JobPickupScreen } from '../screens/jobs/JobPickupScreen';
import { JobInstallScreen } from '../screens/jobs/JobInstallScreen';
import { JobSignScreen } from '../screens/jobs/JobSignScreen';
import { JobSuccessScreen } from '../screens/jobs/JobSuccessScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { COLORS, SIZES } from '../constants/theme';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Job stack navigator
const JobStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JobList" component={JobListScreen} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} />
    <Stack.Screen name="JobPickup" component={JobPickupScreen} />
    <Stack.Screen name="JobInstall" component={JobInstallScreen} />
    <Stack.Screen name="JobSign" component={JobSignScreen} />
    <Stack.Screen name="JobSuccess" component={JobSuccessScreen} />
  </Stack.Navigator>
);

// Bottom tab icon
const TabIcon = ({ icon, label, focused }: { icon: string; label: string; focused: boolean }) => (
  <View style={tabStyles.iconContainer}>
    <Text style={tabStyles.iconText}>{icon}</Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
  </View>
);

// Main app with bottom tabs
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: tabStyles.tabBar,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Jobs"
      component={JobStack}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="📋" label="งานทั้งหมด" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🌐" label="โปรไฟล์" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Auth stack
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

// Root navigator
export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.global);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
    height: 60,
    paddingBottom: 8,
  },
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20 },
  label: { fontSize: SIZES.xs, color: COLORS.gray400, marginTop: 2 },
  labelActive: { color: COLORS.primary, fontWeight: '600' },
});
