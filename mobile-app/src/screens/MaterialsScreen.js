import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS } from '../utils/theme';

const MaterialsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState([
    {
      id: '1',
      title: 'Advanced Cybernetics 101',
      type: 'PDF',
      size: '2.4 MB',
      date: '2023-10-24',
      icon: 'picture-as-pdf',
      color: COLORS.primary,
    },
    {
      id: '2',
      title: 'Neural Network Architecture',
      type: 'VIDEO',
      size: '156 MB',
      date: '2023-10-22',
      icon: 'play-circle-filled',
      color: COLORS.secondary,
    },
    {
      id: '3',
      title: 'Quantum Computing Basics',
      type: 'DOC',
      size: '1.2 MB',
      date: '2023-10-20',
      icon: 'description',
      color: COLORS.warning,
    },
    {
      id: '4',
      title: 'System Security Protocols',
      type: 'PDF',
      size: '5.1 MB',
      date: '2023-10-18',
      icon: 'picture-as-pdf',
      color: COLORS.primary,
    },
    {
      id: '5',
      title: 'AI Ethics Guidelines',
      type: 'LINK',
      size: '-',
      date: '2023-10-15',
      icon: 'link',
      color: COLORS.success,
    },
  ]);

  const filteredMaterials = materials.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.iconContainer, { borderColor: item.color }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardType}>{item.type}</Text>
          <Text style={styles.cardSeparator}>•</Text>
          <Text style={styles.cardSize}>{item.size}</Text>
          <Text style={styles.cardSeparator}>•</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.downloadButton}>
        <Icon name="file-download" size={20} color={COLORS.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DATA_ARCHIVES</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH_DATABASE..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Content */}
      <FlatList
        data={filteredMaterials}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
    ...SHADOWS.neon,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  cardSeparator: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  cardSize: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  downloadButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
  },
});

export default MaterialsScreen;
