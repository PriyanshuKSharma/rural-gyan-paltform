import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/apiService';
import { COLORS, SHADOWS } from '../utils/theme';

const AttendanceScreen = ({ route, navigation }) => {
  const { classId } = route.params;
  const [attendance, setAttendance] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAttendance();
    fetchClassData();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await apiService.get(`/virtual-class/${classId}/attendance`);
      setAttendance(response.data.data || []);
    } catch (error) {
      Alert.alert('ERROR', 'FAILED TO FETCH ATTENDANCE');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchClassData = async () => {
    try {
      const response = await apiService.get(`/virtual-class/${classId}`);
      setClassData(response.data.data);
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };

  const markAttendance = async (studentId, isPresent) => {
    try {
      await apiService.patch(`/virtual-class/${classId}/attendance/mark`, {
        studentId,
        isPresent,
      });
      fetchAttendance();
    } catch (error) {
      Alert.alert('ERROR', 'FAILED TO MARK ATTENDANCE');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const formatDuration = (joinedAt, leftAt) => {
    if (!joinedAt) return 'N/A';
    
    const start = new Date(joinedAt);
    const end = leftAt ? new Date(leftAt) : new Date();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / (1000 * 60));
    
    return `${minutes} MIN`;
  };

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.studentInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.student?.fullName?.charAt(0) || 'S'}
          </Text>
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{item.student?.fullName}</Text>
          <Text style={styles.studentEmail}>{item.student?.email}</Text>
          <View style={styles.durationContainer}>
            <Icon name="timer" size={12} color={COLORS.textSecondary} />
            <Text style={styles.duration}>
              DURATION: {formatDuration(item.joinedAt, item.leftAt)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.attendanceStatus}>
        <View style={[
          styles.statusBadge,
          { borderColor: item.isPresent ? COLORS.success : COLORS.error }
        ]}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: item.isPresent ? COLORS.success : COLORS.error }
          ]} />
          <Text style={[
            styles.statusText,
            { color: item.isPresent ? COLORS.success : COLORS.error }
          ]}>
            {item.isPresent ? 'PRESENT' : 'ABSENT'}
          </Text>
        </View>

        <View style={styles.attendanceActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.presentButton]}
            onPress={() => markAttendance(item.student._id, true)}
          >
            <Icon name="check" size={16} color={COLORS.background} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.absentButton]}
            onPress={() => markAttendance(item.student._id, false)}
          >
            <Icon name="close" size={16} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const presentCount = attendance.filter(a => a.isPresent).length;
  const absentCount = attendance.filter(a => !a.isPresent).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Decorative Elements */}
      <View style={styles.bgGlowTop} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>ATTENDANCE_LOG</Text>
          {classData && (
            <Text style={styles.headerSubtitle}>{classData.title}</Text>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{presentCount}</Text>
          <Text style={styles.statLabel}>PRESENT</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.error }]}>{absentCount}</Text>
          <Text style={styles.statLabel}>ABSENT</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{attendance.length}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
      </View>

      {/* Attendance List */}
      <FlatList
        data={attendance}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.student._id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Icon name="group" size={48} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.emptyText}>NO ATTENDANCE RECORDS</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    ...SHADOWS.card,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  listContainer: {
    padding: 16,
  },
  attendanceItem: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 243, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  studentEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  duration: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  attendanceStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  attendanceActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    ...SHADOWS.neon,
  },
  presentButton: {
    backgroundColor: COLORS.success,
  },
  absentButton: {
    backgroundColor: COLORS.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default AttendanceScreen;