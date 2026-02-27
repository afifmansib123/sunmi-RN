import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../../components/common/Button';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  navigation: any;
}

export const JobSuccessScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <Text style={styles.title}>ปิดงานสำเร็จ!</Text>
          <Text style={styles.subtitle}>
            การดำเนินการเสร็จสมบูรณ์และบันทึกข้อมูลเรียบร้อยแล้ว
          </Text>
          <Button
            title="กลับไปยังหน้าหลัก"
            onPress={() => navigation.navigate('JobList')}
            size="lg"
            style={styles.btn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', padding: SPACING.xl },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.greenLight,
    borderWidth: 2,
    borderColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  icon: { fontSize: 28, color: COLORS.green, fontWeight: '700' },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.green,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  btn: { width: '100%', borderRadius: RADIUS.xl },
});
