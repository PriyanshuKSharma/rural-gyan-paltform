import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { COLORS, SHADOWS } from '../utils/theme';

const VirtualClassListScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const endpoint = user.role === 'teacher' 
        ? '/virtual-class/teacher/classes'
        : '/virtual-class/student/available';
      
      const response = await apiService.get(endpoint);
      setClasses(response.data.data || []);
    } catch (error) {
      Alert.alert('ERROR', 'FAILED TO FETCH CLASSES');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const startClass = async (classId) => {
    try {
      await apiService.patch(`/virtual-class/${classId}/start`);
      navigation.navigate('VirtualClassRoom', { classId });
    } catch (error) {
      Alert.alert('ERROR', 'FAILED TO START CLASS');
    }
  };

  const joinClass = async (classId) => {
    try {
      await apiService.post(`/virtual-class/${classId}/join`);
      navigation.navigate('VirtualClassRoom', { classId });
    } catch (error) {
      Alert.alert('ERROR', error.response?.data?.message || 'FAILED TO JOIN CLASS');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return COLORS.warning;
      case 'live': return COLORS.error;
      case 'ended': return COLORS.textSecondary;
      default: return COLORS.textSecondary;
    }
  };

  const renderClassItem = ({ item }) => (
    <View style={styles.classCard}>
      <View style={styles.classHeader}>
        <Text style={styles.classTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { borderColor: getStatusColor(item.status) }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Icon name="class" size={16} color={COLORS.primary} />
        <Text style={styles.classSubject}>{item.subject} - GRADE {item.grade}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="schedule" size={16} color={COLORS.secondary} />
        <Text style={styles.classTime}>
          {new Date(item.scheduledAt).toLocaleString()}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="timer" size={16} color={COLORS.warning} />
        <Text style={styles.classDuration}>{item.duration} MINS</Text>
      </View>

      {item.description && (
        <Text style={styles.classDescription}>{item.description}</Text>
      )}

      <View style={styles.classActions}>
        {user.role === 'teacher' ? (
          <>
            {item.status === 'scheduled' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.startButton]}
                onPress={() => startClass(item._id)}
              >
                <Icon name="play-arrow" size={20} color={COLORS.background} />
                <Text style={styles.actionButtonText}>START CLASS</Text>
              </TouchableOpacity>
            )}
            {item.status === 'live' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.joinButton]}
                onPress={() => navigation.navigate('VirtualClassRoom', { classId: item._id })}
              >
                <Icon name="video-call" size={20} color={COLORS.background} />
                <Text style={styles.actionButtonText}>JOIN CLASS</Text>
              </TouchableOpacity>
            )}
            {(item.status === 'ended' || item.status === 'cancelled') && (
              <TouchableOpacity
                style={[styles.actionButton, styles.attendanceButton]}
                onPress={() => navigation.navigate('Attendance', { classId: item._id })}
              >
                <Icon name="group" size={20} color={COLORS.text} />
                <Text style={styles.actionButtonTextOutline}>ATTENDANCE</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {item.status === 'live' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.joinButton]}
                onPress={() => joinClass(item._id)}
              >
                <Icon name="video-call" size={20} color={COLORS.background} />
                <Text style={styles.actionButtonText}>JOIN LIVE CLASS</Text>
              </TouchableOpacity>
            )}
            {item.status === 'scheduled' && (
              <View style={[styles.actionButton, styles.scheduledButton]}>
                <Icon name="schedule" size={20} color={COLORS.textSecondary} />
                <Text style={[styles.actionButtonText, { color: COLORS.textSecondary }]}>SCHEDULED</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Decorative Elements */}
      <View style={styles.bgGlowTop} />

      <FlatList
        data={classes}
        renderItem={renderClassItem}
        keyExtractor={(item) => item._id}
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
              <Icon name="video-call" size={48} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.emptyText}>NO CLASSES AVAILABLE</Text>
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
  listContainer: {
    padding: 16,
  },
  classCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classSubject: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  classTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  classDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  classDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  classActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
    ...SHADOWS.neon,
  },
  startButton: {
    backgroundColor: COLORS.success,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
  },
  attendanceButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  scheduledButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  actionButtonTextOutline: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
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

export default VirtualClassListScreen;