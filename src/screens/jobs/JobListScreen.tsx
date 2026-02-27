import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { setSelectedJob } from '../../state/slices/jobsSlice';
import { Job } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Button } from '../../components/common/Button';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  navigation: any;
}

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { jobs } = useAppSelector((state) => state.jobs);
  const { user } = useAppSelector((state) => state.global);

  const handleJobPress = (job: Job) => {
    dispatch(setSelectedJob(job));
    navigation.navigate('JobDetail', { jobId: job.id });
  };

  const renderJob = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      {/* Job number + status */}
      <View style={styles.jobHeader}>
        <View style={styles.jobNumberRow}>
          <Text style={styles.hashIcon}>#</Text>
          <Text style={styles.jobNumber}>{item.jobNo}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.jobDate}>นัดหมาย: {item.dueDate} - {item.dueTime}</Text>

      {/* Warehouse */}
      <View style={styles.section}>
        <SectionHeader icon="🏬" title="จุดรับสินค้า" />
        <Text style={styles.infoLabel}>
          คลังสินค้า: <Text style={styles.infoValue}>{item.warehouse.name}</Text>
        </Text>
        <Text style={styles.infoLabel}>
          โค้ด: <Text style={styles.infoValue}>{item.warehouse.code}</Text>
        </Text>
      </View>

      {/* Customer */}
      <View style={styles.section}>
        <SectionHeader icon="👤" title="ข้อมูลลูกค้า" />
        <Text style={styles.infoLabel}>
          ร้านค้า: <Text style={styles.infoValue}>{item.customer.storeName}</Text>
        </Text>
        <Text style={styles.infoLabel}>
          เบอร์โทร: <Text style={styles.infoValue}>{item.customer.phone}</Text>
        </Text>
      </View>

      {/* Products */}
      <View style={styles.section}>
        <SectionHeader
          icon="📦"
          title={`รายการสินค้า (${item.products.reduce((s, p) => s + p.quantity, 0)} รายการ)`}
        />
        {item.products.map((p, idx) => (
          <Text key={p.id} style={styles.productItem}>
            {idx + 1}. {p.name}  <Text style={styles.qty}>x {p.quantity}</Text>
          </Text>
        ))}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        {item.status === 'กำลังโปรับของ' ? (
          <>
            <Button
              title="ติดต่อคลัง"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.actionBtn}
            />
            <Button
              title="นำทาง"
              onPress={() => {}}
              size="sm"
              style={styles.actionBtn}
            />
          </>
        ) : (
          <>
            <Button
              title="ดูรายละเอียด"
              onPress={() => handleJobPress(item)}
              variant="outline"
              size="sm"
              style={styles.actionBtn}
            />
            <Button
              title="โปรับสินค้า"
              onPress={() => handleJobPress(item)}
              size="sm"
              style={styles.actionBtn}
            />
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>งานทั้งหมด</Text>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </Text>
        </View>
      </View>

      {/* Filter pill */}
      <View style={styles.filterRow}>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>งานที่ต้องทำ: ({jobs.length})</Text>
          <Text style={styles.filterIcon}>⚡</Text>
        </View>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E91E8C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: SIZES.md },
  filterRow: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  filterText: { fontSize: SIZES.sm, color: COLORS.gray700, marginRight: 6 },
  filterIcon: { fontSize: 14 },
  list: { padding: SPACING.lg, gap: SPACING.md },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: SPACING.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobNumberRow: { flexDirection: 'row', alignItems: 'center' },
  hashIcon: { color: COLORS.primary, fontWeight: '700', marginRight: 2, fontSize: SIZES.md },
  jobNumber: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.primary },
  jobDate: { fontSize: SIZES.sm, color: COLORS.gray500, marginBottom: SPACING.md },
  section: { marginBottom: SPACING.md },
  infoLabel: { fontSize: SIZES.sm, color: COLORS.gray500, marginBottom: 2 },
  infoValue: { color: COLORS.gray700, fontWeight: '500' },
  productItem: { fontSize: SIZES.sm, color: COLORS.gray700, marginBottom: 2 },
  qty: { color: COLORS.primary, fontWeight: '700' },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionBtn: { flex: 1 },
});
