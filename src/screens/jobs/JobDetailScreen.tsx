import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { updateJobStatus } from '../../state/slices/jobsSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Button } from '../../components/common/Button';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  navigation: any;
  route: any;
}

export const JobDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { jobId } = route.params;
  const job = useAppSelector((state) =>
    state.jobs.jobs.find((j) => j.id === jobId)
  );

  if (!job) return null;

  const isReadyForPickup = job.status === 'รอรับของ';
  const isInTransit = job.status === 'กำลังเดินทาง';

  const handlePickup = () => {
    navigation.navigate('JobPickup', { jobId: job.id });
  };

  const handleNavigate = () => {
    // Mark as in transit after pickup
    dispatch(updateJobStatus({ jobId: job.id, status: 'กำลังเดินทาง' }));
  };

  const handleArrived = () => {
    navigation.navigate('JobInstall', { jobId: job.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isInTransit ? 'กำลังเดินทาง' : job.jobNo}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Job banner */}
        <View style={styles.jobBanner}>
          <View style={styles.jobBannerLeft}>
            <Text style={styles.bannerJobNo}># {job.jobNo}</Text>
            <Text style={styles.bannerDate}>นัดหมาย: {job.dueDate} - {job.dueTime}</Text>
          </View>
          <StatusBadge status={job.status} />
        </View>

        {isInTransit ? (
          // In-transit view
          <>
            {/* Customer */}
            <View style={styles.section}>
              <SectionHeader icon="👤" title="ลูกค้าปลายทาง" />
              <Text style={styles.infoRow}>ร้านค้า: <Text style={styles.infoVal}>{job.customer.storeName}</Text></Text>
              <Text style={styles.infoRow}>ชื่อลูกค้า: <Text style={styles.infoVal}>{job.customer.contactName}</Text></Text>
              <Text style={styles.infoRow}>เบอร์โทร: <Text style={styles.infoVal}>{job.customer.phone}</Text></Text>
              <Text style={styles.infoRow}>เลขใบเสร็จ: <Text style={styles.infoVal}>{job.customer.invoiceNo}</Text></Text>
              <Button title="โทรหาลูกค้า" onPress={() => {}} variant="outline" size="sm" style={styles.contactBtn} />
            </View>

            {/* Install location */}
            <View style={styles.section}>
              <SectionHeader icon="📍" title="สถานที่ติดตั้ง" />
              <Text style={styles.infoRow}>{job.installLocation.address}</Text>
              <Text style={styles.infoRow}>ตำบล: {job.installLocation.subDistrict}</Text>
              <Text style={styles.infoRow}>อำเภอ: {job.installLocation.district}</Text>
              <Text style={styles.infoRow}>จังหวัด: {job.installLocation.province}</Text>
              <Button title="ดูแผนที่จ้น" onPress={() => {}} variant="outline" size="sm" style={styles.contactBtn} />
            </View>

            {/* Products */}
            <View style={styles.section}>
              <SectionHeader icon="📦" title={`รายการสินค้าในรถ (รับของแล้ว)`} />
              {job.products.map((p, idx) => (
                <View key={p.id} style={{ marginBottom: SPACING.sm }}>
                  <Text style={styles.productName}>
                    {idx + 1}. {p.name} <Text style={styles.qty}>จำนวน x{p.quantity}</Text>
                  </Text>
                  {p.serialNumbers.map((sn) => (
                    <Text key={sn.sn} style={styles.snItem}>(S/N) {sn.sn} ✓</Text>
                  ))}
                </View>
              ))}
            </View>
          </>
        ) : (
          // Normal job detail view
          <>
            {/* Warehouse */}
            <View style={styles.section}>
              <SectionHeader icon="🏬" title="จุดรับสินค้า" />
              <Text style={styles.infoRow}>คลังสินค้า: <Text style={styles.infoVal}>{job.warehouse.name}</Text></Text>
              <Text style={styles.infoRow}>โค้ด: <Text style={styles.infoVal}>{job.warehouse.code}</Text></Text>
              <Text style={styles.infoRow}>ที่อยู่: <Text style={styles.infoVal}>{job.warehouse.address}</Text></Text>
              <View style={styles.btnRow}>
                <Button title="โทรหาคลัง" onPress={() => {}} variant="outline" size="sm" style={styles.halfBtn} />
                <Button title="ดูแผนที่ตั้ง" onPress={() => {}} variant="outline" size="sm" style={styles.halfBtn} />
              </View>
            </View>

            {/* Customer */}
            <View style={styles.section}>
              <SectionHeader icon="👤" title="ลูกค้าปลายทาง" />
              <Text style={styles.infoRow}>ร้านค้า: <Text style={styles.infoVal}>{job.customer.storeName}</Text></Text>
              <Text style={styles.infoRow}>ชื่อลูกค้า: <Text style={styles.infoVal}>{job.customer.contactName}</Text></Text>
              <Text style={styles.infoRow}>เบอร์โทร: <Text style={styles.infoVal}>{job.customer.phone}</Text></Text>
              <Text style={styles.infoRow}>เลขใบเสร็จ: <Text style={styles.infoVal}>{job.customer.invoiceNo}</Text></Text>
              <Button title="โทรหาลูกค้า" onPress={() => {}} variant="outline" size="sm" style={styles.contactBtn} />
            </View>

            {/* Install location */}
            <View style={styles.section}>
              <SectionHeader icon="📍" title="สถานที่ติดตั้ง" />
              <Text style={styles.infoRow}>{job.installLocation.address}</Text>
              <Text style={styles.infoRow}>ตำบล: {job.installLocation.subDistrict}</Text>
              <Text style={styles.infoRow}>อำเภอ: {job.installLocation.district}</Text>
              <Text style={styles.infoRow}>จังหวัด: {job.installLocation.province}</Text>
              <Button title="ดูแผนที่จ้น" onPress={() => {}} variant="outline" size="sm" style={styles.contactBtn} />
            </View>

            {/* Products */}
            <View style={styles.section}>
              <SectionHeader icon="📦" title={`รายการสินค้า (${job.products.reduce((s,p) => s+p.quantity,0)} รายการ)`} />
              {job.products.map((p, idx) => (
                <Text key={p.id} style={styles.productItem}>
                  {idx + 1}. {p.name}  <Text style={styles.qty}>x {p.quantity}</Text>
                </Text>
              ))}
            </View>

            {/* Notes */}
            {job.notes && (
              <View style={styles.section}>
                <SectionHeader icon="📋" title="หมายเหตุ" />
                <Text style={styles.notes}>{job.notes}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <Button
          title="กลับหน้าหลัก"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="md"
          style={styles.bottomBtn}
        />
        {isInTransit ? (
          <Button
            title="ถึงหน้าร้านแล้ว"
            onPress={handleArrived}
            size="md"
            style={styles.bottomBtn}
          />
        ) : isReadyForPickup ? (
          <Button
            title="โปรับสินค้า"
            onPress={handlePickup}
            size="md"
            style={styles.bottomBtn}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 28, color: COLORS.primary, fontWeight: '300' },
  headerTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.primary },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  jobBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  jobBannerLeft: {},
  bannerJobNo: { color: COLORS.white, fontWeight: '700', fontSize: SIZES.lg },
  bannerDate: { color: 'rgba(255,255,255,0.8)', fontSize: SIZES.sm, marginTop: 2 },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  infoRow: { fontSize: SIZES.sm, color: COLORS.gray500, marginBottom: 4 },
  infoVal: { color: COLORS.gray800, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  halfBtn: { flex: 1 },
  contactBtn: { marginTop: SPACING.sm, alignSelf: 'flex-start' },
  productItem: { fontSize: SIZES.sm, color: COLORS.gray700, marginBottom: 4 },
  productName: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray800, marginBottom: 2 },
  snItem: { fontSize: SIZES.sm, color: COLORS.gray500, marginLeft: SPACING.lg },
  qty: { color: COLORS.primary, fontWeight: '700' },
  notes: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    fontStyle: 'italic',
    backgroundColor: COLORS.gray50,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  bottomBtn: { flex: 1 },
});
