import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { COLORS, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalClasses: 0,
    upcomingClasses: 0,
    completedAssignments: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load dashboard data based on user role
      if (user?.role === 'student') {
        const response = await apiService.get('/student/dashboard');
        setStats(response.data);
      } else if (user?.role === 'teacher') {
        const response = await apiService.get('/teacher/dashboard');
        setStats(response.data);
      } else if (user?.role === 'admin') {
        const response = await apiService.get('/admin/analytics');
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'SYSTEM INITIALIZED';
    if (hour < 18) return 'SYSTEM ACTIVE';
    return 'SYSTEM STANDBY';
  };

  const getQuickActions = () => {
    if (user?.role === 'student') {
      return [
        { title: 'JOIN CLASS', icon: 'video-call', color: COLORS.primary, route: 'VirtualClassList' },
        { title: 'AI TUTOR', icon: 'psychology', color: COLORS.secondary, route: 'AITutor' },
        { title: 'MATERIALS', icon: 'library-books', color: COLORS.warning, route: 'Materials' },
        { title: 'CODE EDITOR', icon: 'code', color: COLORS.error, route: 'CodeEditor' },
      ];
    } else if (user?.role === 'teacher') {
      return [
        { title: 'MY CLASSES', icon: 'video-call', color: COLORS.primary, route: 'VirtualClassList' },
        { title: 'CREATE QUIZ', icon: 'quiz', color: COLORS.secondary, route: 'CreateQuiz' },
        { title: 'STUDENTS', icon: 'people', color: COLORS.warning, route: 'Students' },
        { title: 'ANALYTICS', icon: 'analytics', color: COLORS.error, route: 'Analytics' },
      ];
    } else {
      return [
        { title: 'TEACHERS', icon: 'people', color: COLORS.primary, route: 'Teachers' },
        { title: 'STUDENTS', icon: 'school', color: COLORS.secondary, route: 'Students' },
        { title: 'ANALYTICS', icon: 'analytics', color: COLORS.warning, route: 'Analytics' },
        { title: 'REPORTS', icon: 'assessment', color: COLORS.error, route: 'Reports' },
      ];
    }
  };

  const getStatsCards = () => {
    if (user?.role === 'student') {
      return [
        { title: 'CLASSES', value: stats.totalClasses || 0, icon: 'video-call', color: COLORS.primary },
        { title: 'UPCOMING', value: stats.upcomingClasses || 0, icon: 'schedule', color: COLORS.success },
        { title: 'ASSIGNMENTS', value: stats.completedAssignments || 0, icon: 'assignment', color: COLORS.warning },
        { title: 'PROGRESS', value: '85%', icon: 'trending-up', color: COLORS.secondary },
      ];
    } else if (user?.role === 'teacher') {
      return [
        { title: 'CLASSES', value: stats.totalClasses || 0, icon: 'video-call', color: COLORS.primary },
        { title: 'STUDENTS', value: stats.totalStudents || 0, icon: 'people', color: COLORS.success },
        { title: 'QUIZZES', value: stats.totalQuizzes || 0, icon: 'quiz', color: COLORS.warning },
        { title: 'ATTENDANCE', value: '92%', icon: 'how-to-reg', color: COLORS.secondary },
      ];
    } else {
      return [
        { title: 'USERS', value: stats.totalUsers || 0, icon: 'people', color: COLORS.primary },
        { title: 'TEACHERS', value: stats.totalTeachers || 0, icon: 'person', color: COLORS.success },
        { title: 'STUDENTS', value: stats.totalStudents || 0, icon: 'school', color: COLORS.warning },
        { title: 'CLASSES', value: stats.totalClasses || 0, icon: 'video-call', color: COLORS.secondary },
      ];
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Decorative Elements */}
      <View style={styles.bgGlowTop} />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || user?.username}</Text>
            <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIconContainer}>
              <Icon name="person" size={24} color={COLORS.background} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {getStatsCards().map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { borderColor: stat.color }]}>
                <Icon name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            {getQuickActions().map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.route)}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Icon name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM LOGS</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="video-call" size={16} color={COLORS.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>CLASS_SESSION_INIT</Text>
                <Text style={styles.activityTime}>2 HOURS AGO</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="assignment" size={16} color={COLORS.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>ASSIGNMENT_UPLOAD</Text>
                <Text style={styles.activityTime}>1 DAY AGO</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="quiz" size={16} color={COLORS.secondary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>QUIZ_COMPLETION</Text>
                <Text style={styles.activityTime}>2 DAYS AGO</Text>
              </View>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 10,
    color: COLORS.primary,
    marginBottom: 4,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.neon,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    width: (width - 64) / 2,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    letterSpacing: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    width: (width - 64) / 2,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  activityContainer: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  activityTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});

export default DashboardScreen;