import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await login(credentials);
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background Decorative Elements */}
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icon name="school" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.logoText}>NDEMLP</Text>
        </View>
        <TouchableOpacity style={styles.languageButton}>
          <Text style={styles.languageButtonText}>EN / HI</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            
            {/* Branding */}
            <View style={styles.brandingContainer}>
              <Text style={styles.systemText}>SYSTEM: ONLINE // VER: 2.0.77</Text>
              <Text style={styles.title}>FUTURE OF LEARNING</Text>
              <View style={styles.divider} />
            </View>

            {/* Form */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>ACCESS TERMINAL</Text>
                <View style={styles.statusDots}>
                  <View style={[styles.dot, { backgroundColor: COLORS.error }]} />
                  <View style={[styles.dot, { backgroundColor: COLORS.warning }]} />
                  <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
                </View>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="error-outline" size={20} color={COLORS.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>USERNAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ENTER_USERNAME"
                    placeholderTextColor={COLORS.textSecondary}
                    value={credentials.username}
                    onChangeText={(text) => {
                      setCredentials({...credentials, username: text});
                      setError('');
                    }}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="ENTER_PASSWORD"
                      placeholderTextColor={COLORS.textSecondary}
                      value={credentials.password}
                      onChangeText={(text) => {
                        setCredentials({...credentials, password: text});
                        setError('');
                      }}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon 
                        name={showPassword ? 'visibility-off' : 'visibility'} 
                        size={20} 
                        color={COLORS.primary} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'INITIALIZING...' : 'LOGIN'}
                  </Text>
                  {!loading && <Icon name="arrow-forward" size={20} color={COLORS.background} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>ACCESS CODES:</Text>
              <View style={styles.demoRow}>
                <Text style={styles.demoLabel}>ADMIN:</Text>
                <Text style={styles.demoValue}>admin / admin123</Text>
              </View>
              <View style={styles.demoRow}>
                <Text style={styles.demoLabel}>TEACHER:</Text>
                <Text style={styles.demoValue}>teacher1 / teacher123</Text>
              </View>
              <View style={styles.demoRow}>
                <Text style={styles.demoLabel}>STUDENT:</Text>
                <Text style={styles.demoValue}>student1 / student123</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLink}>CREATE ACCOUNT &gt;</Text>
              </TouchableOpacity>
            </View>

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
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  bgGlowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.secondary,
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 243, 255, 0.1)',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 2,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
    width: '100%',
  },
  brandingContainer: {
    marginBottom: 32,
  },
  systemText: {
    color: COLORS.primary,
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
    backgroundColor: COLORS.secondary,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: 'bold',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
  },
  eyeButton: {
    padding: 12,
  },
  loginButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    ...SHADOWS.neon,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  demoContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(14, 116, 144, 0.3)',
  },
  demoTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  demoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  demoLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    width: 80,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  demoValue: {
    color: COLORS.text,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LoginScreen;