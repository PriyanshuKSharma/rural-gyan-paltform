import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS } from '../utils/theme';

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      Alert.alert('ERROR', 'PLEASE FILL IN ALL FIELDS');
      return;
    }

    Alert.alert(
      'REGISTRATION',
      'REGISTRATION IS HANDLED BY ADMINISTRATORS. PLEASE CONTACT YOUR SCHOOL ADMINISTRATOR TO CREATE AN ACCOUNT.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Decorative Elements */}
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            
            {/* Branding */}
            <View style={styles.brandingContainer}>
              <Text style={styles.systemText}>SYSTEM: REGISTRATION // NEW USER</Text>
              <Text style={styles.title}>CREATE ACCOUNT</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>USER DETAILS</Text>
                <View style={styles.statusDots}>
                  <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
                  <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
                </View>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>FULL NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ENTER FULL NAME"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.fullName}
                    onChangeText={(value) => updateFormData('fullName', value)}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>USERNAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="CHOOSE USERNAME"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.username}
                    onChangeText={(value) => updateFormData('username', value)}
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ENTER EMAIL"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="CHOOSE PASSWORD"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'PROCESSING...' : 'REGISTER'}
                  </Text>
                  {!loading && <Icon name="person-add" size={20} color={COLORS.background} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>
                ALREADY HAVE AN ACCOUNT? SIGN IN &gt;
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.secondary,
    opacity: 0.1,
  },
  bgGlowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    paddingHorizontal: 24,
    width: '100%',
  },
  brandingContainer: {
    marginBottom: 32,
  },
  systemText: {
    color: COLORS.secondary,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 40,
    marginBottom: 16,
  },
  divider: {
    height: 2,
    width: 60,
    backgroundColor: COLORS.primary,
  },
  card: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
  },
  button: {
    height: 50,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    ...SHADOWS.neon,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SignUpScreen;