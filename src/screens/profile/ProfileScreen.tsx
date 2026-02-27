import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { logout as logoutAction } from '../../state/slices/globalSlice';
import { useLogoutMutation } from '../../state/api';
import { Button } from '../../components/common/Button';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.global);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = () => {
    Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบใช่ไหม?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutApi().unwrap();
          } catch {
            // Ignore API error, still logout locally
          }
          dispatch(logoutAction());
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>โปรไฟล์</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || user?.email || '-'}</Text>
          <Text style={styles.role}>{user?.role || '-'}</Text>
        </View>

        <View style={styles.card}>
          <InfoRow label="อีเมล" value={user?.email || '-'} />
          <InfoRow label="เบอร์โทร" value={user?.phone || '-'} />
          <InfoRow label="ตำแหน่ง" value={user?.role || '-'} />
        </View>

        <Button
          title="ออกจากระบบ"
          onPress={handleLogout}
          variant="outline"
          size="lg"
          style={styles.logoutBtn}
          textStyle={{ color: COLORS.red }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  headerTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.primary },
  scroll: { padding: SPACING.lg },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#E91E8C',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: { color: COLORS.white, fontSize: SIZES.xxxl, fontWeight: '700' },
  name: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.gray800 },
  role: { fontSize: SIZES.md, color: COLORS.gray500, marginTop: 4 },
  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  infoLabel: { fontSize: SIZES.md, color: COLORS.gray500 },
  infoValue: { fontSize: SIZES.md, fontWeight: '500', color: COLORS.gray800 },
  logoutBtn: { borderColor: COLORS.red },
});
