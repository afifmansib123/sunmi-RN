import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { markSnInstalled, updateJobStatus } from '../../state/slices/jobsSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Button } from '../../components/common/Button';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  navigation: any;
  route: any;
}

interface CheckState {
  [key: string]: { [itemId: string]: boolean };
}

export const JobInstallScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { jobId } = route.params;
  const job = useAppSelector((state) => state.jobs.jobs.find((j) => j.id === jobId));

  // Track checklist state: { snKey: { checkId: boolean } }
  const [checks, setChecks] = useState<CheckState>({});
  const [selectedItem, setSelectedItem] = useState<{ productId: string; sn: string } | null>(null);

  if (!job) return null;

  const allSns = job.products.flatMap((p) =>
    p.serialNumbers.map((s) => ({ ...s, productId: p.id, productName: p.name }))
  );

  const DEFAULT_CHECKLIST = [
    { id: 'c1', label: 'เปิดเครื่องได้ เชื่อมต่อ WIFI / อินเทอร์เน็ต' },
    { id: 'c2', label: 'หน้าจอกสีครับและแสงผลผฝนิดิ' },
    { id: 'c3', label: 'ทดสอบเครื่องพิมพ์' },
    { id: 'c4', label: 'ทดสอบแดมเตอร์ (สาขา/ร้า)' },
  ];

  const getSnKey = (productId: string, sn: string) => `${productId}_${sn}`;

  const toggleCheck = (snKey: string, checkId: string) => {
    setChecks((prev) => ({
      ...prev,
      [snKey]: { ...(prev[snKey] || {}), [checkId]: !prev[snKey]?.[checkId] },
    }));
  };

  const isSnInstallDone = (productId: string, sn: string) => {
    const key = getSnKey(productId, sn);
    const snChecks = checks[key] || {};
    return DEFAULT_CHECKLIST.every((c) => snChecks[c.id]);
  };

  const installedCount = allSns.filter((s) => isSnInstallDone(s.productId, s.sn)).length;
  const allDone = installedCount === allSns.length;

  const handleSummary = () => {
    if (!allDone) {
      Alert.alert('ยังไม่ครบ', 'กรุณาตรวจสอบการติดตั้งสินค้าให้ครบถ้วน');
      return;
    }
    dispatch(updateJobStatus({ jobId: job.id, status: 'รอลูกค้าเซ็น' }));
    navigation.navigate('JobSign', { jobId: job.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>กำลังติดตั้ง (On-Site)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Job banner */}
        <View style={styles.jobBanner}>
          <View>
            <Text style={styles.bannerJobNo}># {job.jobNo}</Text>
            <Text style={styles.bannerDate}>นัดหมาย: {job.dueDate} - {job.dueTime}</Text>
          </View>
          <StatusBadge status={job.status} />
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

        {/* Products with install checklist */}
        <View style={styles.section}>
          <SectionHeader
            icon="📦"
            title={`รายการสินค้าที่ต้องติดตั้ง`}
            rightText={`(${installedCount}/${allSns.length} เสร็จแล้ว)`}
            rightColor={allDone ? COLORS.green : COLORS.primary}
          />
          {job.products.map((product, pIdx) => (
            <View key={product.id} style={styles.productBlock}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{pIdx + 1}. {product.name}</Text>
                <Text style={styles.qty}>จำนวน x{product.quantity}</Text>
              </View>
              {product.serialNumbers.map((snItem) => {
                const snKey = getSnKey(product.id, snItem.sn);
                const isDone = isSnInstallDone(product.id, snItem.sn);
                return (
                  <View key={snItem.sn} style={styles.snRow}>
                    <View style={styles.snLeft}>
                      <Text style={[styles.snText, isDone && styles.snDone]}>
                        (S/N) {snItem.sn} {isDone ? '✓' : ''}
                      </Text>
                    </View>
                    <View style={styles.snActions}>
                      <TouchableOpacity
                        onPress={() =>
                          setSelectedItem(
                            selectedItem?.sn === snItem.sn ? null : { productId: product.id, sn: snItem.sn }
                          )
                        }
                        style={[styles.snBtn, styles.snEditBtn]}
                      >
                        <Text style={styles.snEditText}>✏ แก้ไข</Text>
                      </TouchableOpacity>
                      {!isDone ? (
                        <View style={[styles.snBtn, styles.snPendingBtn]}>
                          <Text style={styles.snPendingText}>⏳ ยังไม่ติดตั้ง</Text>
                        </View>
                      ) : (
                        <View style={[styles.snBtn, styles.snDoneBtn]}>
                          <Text style={styles.snDoneText}>✓ ติดตั้งแล้ว</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Expanded checklist for selected item */}
        {selectedItem && (
          <View style={styles.checklistSection}>
            <Text style={styles.checklistTitle}>
              แบบฟอร์มตรวจสอบ — (S/N): {selectedItem.sn}
            </Text>

            <Text style={styles.checklistGroupTitle}>ส่วนที่ 1: ตรวจสอบกล่อง</Text>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoText}>📷 อัพโหลดรูปภาพ</Text>
            </View>

            <Text style={styles.checklistGroupTitle}>ส่วนที่ 2: ติดตั้งและตรวจสอบ</Text>
            {DEFAULT_CHECKLIST.map((item) => {
              const key = getSnKey(selectedItem.productId, selectedItem.sn);
              const checked = checks[key]?.[item.id] || false;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checkRow}
                  onPress={() => toggleCheck(key, item.id)}
                >
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.checklistGroupTitle}>ส่วนที่ 3: สรุปผล</Text>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoText}>📷 อัพโหลดรูปภาพ</Text>
            </View>

            <Button
              title="✓ บันทึกการติดตั้ง"
              onPress={() => setSelectedItem(null)}
              size="md"
              style={{ marginTop: SPACING.md }}
            />
          </View>
        )}

        {!allDone && (
          <Text style={styles.warning}>⚠ กรุณาตรวจสอบการติดตั้งสินค้าให้ครบถ้วน</Text>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <Button title="กลับหน้าหลัก" onPress={() => navigation.goBack()} variant="outline" size="md" style={styles.bottomBtn} />
        <Button
          title="สรุปและปิดงาน"
          onPress={handleSummary}
          size="md"
          disabled={!allDone}
          style={styles.bottomBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 28, color: COLORS.primary, fontWeight: '300' },
  headerTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.primary },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  jobBanner: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bannerJobNo: { color: COLORS.white, fontWeight: '700', fontSize: SIZES.lg },
  bannerDate: { color: 'rgba(255,255,255,0.8)', fontSize: SIZES.sm, marginTop: 2 },
  section: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  infoRow: { fontSize: SIZES.sm, color: COLORS.gray500, marginBottom: 4 },
  infoVal: { color: COLORS.gray800, fontWeight: '500' },
  contactBtn: { marginTop: SPACING.sm, alignSelf: 'flex-start' },
  productBlock: { marginBottom: SPACING.md },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  productName: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.gray800 },
  qty: { color: COLORS.primary, fontWeight: '700', fontSize: SIZES.sm },
  snRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  snLeft: { flex: 1 },
  snText: { fontSize: SIZES.sm, color: COLORS.gray600 },
  snDone: { color: COLORS.green },
  snActions: { flexDirection: 'row', gap: 4 },
  snBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  snEditBtn: { borderWidth: 1, borderColor: COLORS.primary },
  snEditText: { fontSize: SIZES.xs, color: COLORS.primary },
  snPendingBtn: { backgroundColor: COLORS.gray100 },
  snPendingText: { fontSize: SIZES.xs, color: COLORS.gray500 },
  snDoneBtn: { backgroundColor: COLORS.greenLight },
  snDoneText: { fontSize: SIZES.xs, color: COLORS.green },
  checklistSection: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: SPACING.md,
  },
  checklistTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.md },
  checklistGroupTitle: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray700, marginTop: SPACING.md, marginBottom: SPACING.sm },
  photoPlaceholder: {
    height: 80, backgroundColor: COLORS.gray50, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.gray200, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  photoText: { color: COLORS.gray400, fontSize: SIZES.sm },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2,
    borderColor: COLORS.gray300, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm,
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: SIZES.sm, color: COLORS.gray700 },
  warning: { fontSize: SIZES.sm, color: COLORS.red, textAlign: 'center', marginBottom: SPACING.md },
  bottomActions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: SPACING.sm, padding: SPACING.lg,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray100,
  },
  bottomBtn: { flex: 1 },
});
