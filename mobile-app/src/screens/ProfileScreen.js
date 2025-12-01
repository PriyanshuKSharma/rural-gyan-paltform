import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../utils/theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'LOGOUT',
      'ARE YOU SURE YOU WANT TO LOGOUT?',
      [
        { text: 'CANCEL', style: 'cancel' },
        { text: 'LOGOUT', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const ProfileItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={20} color={COLORS.primary} />
        </View>
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {value && <Text style={styles.profileItemValue}>{value}</Text>}
        </View>
      </View>
      {onPress && <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Decorative Elements */}
      <View style={styles.bgGlowTop} />

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>ONLINE</Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>USER_DATA</Text>
          
          <ProfileItem
            icon="person"
            title="FULL NAME"
            value={user?.fullName}
          />
          
          <ProfileItem
            icon="alternate-email"
            title="USERNAME"
            value={user?.username}
          />
          
          <ProfileItem
            icon="email"
            title="EMAIL"
            value={user?.email}
          />
          
          <ProfileItem
            icon="badge"
            title="ROLE"
            value={user?.role?.toUpperCase()}
          />
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM_CONFIG</Text>
          
          <ProfileItem
            icon="notifications"
            title="NOTIFICATIONS"
            onPress={() => Alert.alert('COMING SOON', 'NOTIFICATION SETTINGS WILL BE AVAILABLE SOON')}
          />
          
          <ProfileItem
            icon="security"
            title="PRIVACY & SECURITY"
            onPress={() => Alert.alert('COMING SOON', 'PRIVACY SETTINGS WILL BE AVAILABLE SOON')}
          />
          
          <ProfileItem
            icon="help"
            title="HELP & SUPPORT"
            onPress={() => Alert.alert('HELP', 'FOR SUPPORT, PLEASE CONTACT YOUR ADMINISTRATOR')}
          />
          
          <ProfileItem
            icon="info"
            title="ABOUT SYSTEM"
            onPress={() => Alert.alert('ABOUT', 'DIGITAL LEARNING PLATFORM V2.0.77')}
          />
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>TERMINATE SESSION</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  bgGlowTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: 'rgba(31, 41, 55, 0.3)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 0, // Square avatar for tech look
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 243, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.neon,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 12,
    letterSpacing: 1,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileItemText: {
    marginLeft: 16,
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileItemValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ProfileScreen;