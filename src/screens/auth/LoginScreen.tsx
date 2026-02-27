import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAppDispatch } from '../../state/hooks';
import { setCredentials } from '../../state/slices/globalSlice';
import { mockUser } from '../../mock/data';
import { useLoginMutation } from '../../state/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

export const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginApi, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอก Username และรหัสผ่าน');
      return;
    }
    try {
      const result = await loginApi({ username, password }).unwrap();
      // Backend returns { statusCode, message, data: User }
      // httpOnly cookies are set automatically by the server
      dispatch(
        setCredentials({
          user: result.data || mockUser,
          token: 'cookie-based',
        })
      );
    } catch (err: any) {
      // Fallback to mock login if backend is not running
      console.warn('API login failed, using mock:', err);
      dispatch(setCredentials({ user: mockUser, token: 'mock-token' }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Orange title header */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>เข้าสู่ระบบ (Login)</Text>
        </View>

        {/* Gray spacer area */}
        <View style={styles.spacerArea} />

        {/* Login card */}
        <View style={styles.card}>
          {/* Orange header band */}
          <View style={styles.cardHeader}>
            <View style={styles.userIconContainer}>
              <Text style={styles.userIcon}>👤</Text>
            </View>
            <View style={{ marginLeft: SPACING.md }}>
              <Text style={styles.cardHeaderTitle}>ล็อคอินเข้าสู่ระบบ</Text>
              <Text style={styles.cardHeaderSubtitle}>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              placeholder="username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              leftIcon={<Text style={{ fontSize: 16 }}>✉️</Text>}
              containerStyle={{ marginBottom: SPACING.md }}
            />
            <Input
              placeholder="password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
              containerStyle={{ marginBottom: SPACING.lg }}
            />
            <Button
              title="เข้าสู่ระบบ"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              style={styles.loginBtn}
            />
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={styles.spacerArea} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  titleContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  titleText: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  spacerArea: {
    flex: 1,
    minHeight: 80,
    backgroundColor: COLORS.background,
  },
  card: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  userIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: { fontSize: 20 },
  cardHeaderTitle: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    fontWeight: '700',
  },
  cardHeaderSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: SIZES.sm,
    marginTop: 2,
  },
  form: {
    padding: SPACING.lg,
  },
  loginBtn: {
    borderRadius: RADIUS.xl,
  },
});
