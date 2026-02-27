import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { updateSerialNumber, updateJobStatus } from '../../state/slices/jobsSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  navigation: any;
  route: any;
}

export const JobPickupScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { jobId } = route.params;
  const job = useAppSelector((state) => state.jobs.jobs.find((j) => j.id === jobId));

  const [editModal, setEditModal] = useState<{
    visible: boolean;
    productId: string;
    productName: string;
    sn: string;
    inputSn: string;
  }>({ visible: false, productId: '', productName: '', sn: '', inputSn: '' });

  if (!job) return null;

  const allVerified = job.products.every((p) =>
    p.serialNumbers.every((s) => s.verified)
  );

  const openEditModal = (productId: string, productName: string, sn: string) => {
    setEditModal({ visible: true, productId, productName, sn, inputSn: sn });
  };

  const handleConfirmEdit = () => {
    dispatch(
      updateSerialNumber({
        jobId: job.id,
        productId: editModal.productId,
        sn: editModal.sn,
        verified: true,
      })
    );
    setEditModal({ ...editModal, visible: false });
  };

  const handleVerify = (productId: string, sn: string) => {
    dispatch(updateSerialNumber({ jobId: job.id, productId, sn, verified: true }));
  };

  const handleConfirmPickup = () => {
    if (!allVerified) {
      Alert.alert('ยังไม่ครบ', 'กรุณายืนยัน S/N ทุกชิ้นก่อนยืนยันรับของ');
      return;
    }
    dispatch(updateJobStatus({ jobId: job.id, status: 'กำลังเดินทาง' }));
    navigation.navigate('JobDetail', { jobId: job.id });
  };

  const verifiedCount = job.products.reduce(
    (sum, p) => sum + p.serialNumbers.filter((s) => s.verified).length,
    0
  );
  const totalCount = job.products.reduce((sum, p) => sum + p.serialNumbers.length, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รับสินค้า (Pickup)</Text>
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

        {/* Notes */}
        {job.notes && (
          <View style={styles.section}>
            <SectionHeader icon="📋" title="หมายเหตุ" />
            <Text style={styles.notes}>{job.notes}</Text>
          </View>
        )}

        {/* Products with S/N verification */}
        <View style={styles.section}>
          <SectionHeader
            icon="📦"
            title={`รายการสินค้า (${job.products.reduce((s,p)=>s+p.quantity,0)} รายการ)`}
          />
          {job.products.map((product, pIdx) => (
            <View key={product.id} style={styles.productBlock}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{pIdx + 1}. {product.name}</Text>
                <Text style={styles.qty}>จำนวน x{product.quantity}</Text>
              </View>
              {product.serialNumbers.map((snItem) => (
                <View key={snItem.sn} style={styles.snRow}>
                  <Text style={[styles.snText, snItem.verified && styles.snVerified]}>
                    (S/N) {snItem.sn} {snItem.verified ? '✓' : ''}
                  </Text>
                  <View style={styles.snActions}>
                    <TouchableOpacity
                      onPress={() => openEditModal(product.id, product.name, snItem.sn)}
                      style={styles.snEditBtn}
                    >
                      <Text style={styles.snEditText}>✏ แก้ไข</Text>
                    </TouchableOpacity>
                    {!snItem.verified && (
                      <TouchableOpacity
                        onPress={() => handleVerify(product.id, snItem.sn)}
                        style={styles.snVerifyBtn}
                      >
                        <Text style={styles.snVerifyText}>✓ ยืนยัน</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {!allVerified && (
          <Text style={styles.warning}>⚠ กรุณายืนยันรายการสินค้าให้ครบถ้วน</Text>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <Button title="กลับหน้าหลัก" onPress={() => navigation.goBack()} variant="outline" size="md" style={styles.bottomBtn} />
        <Button
          title="ยืนยันรับของ"
          onPress={handleConfirmPickup}
          size="md"
          disabled={!allVerified}
          style={styles.bottomBtn}
        />
      </View>

      {/* Edit S/N Modal */}
      <Modal visible={editModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editModal.productName}</Text>
              <TouchableOpacity onPress={() => setEditModal({ ...editModal, visible: false })}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Serial number (S/N) *</Text>
            <Input
              value={editModal.inputSn}
              onChangeText={(t) => setEditModal({ ...editModal, inputSn: t })}
              placeholder="Enter S/N"
              containerStyle={{ marginBottom: SPACING.lg }}
            />
            <View style={styles.modalActions}>
              <Button
                title="‹ ยกเลิก"
                onPress={() => setEditModal({ ...editModal, visible: false })}
                variant="outline"
                size="sm"
                style={styles.modalBtn}
              />
              <Button
                title="✓ ยืนยันการแก้ไข"
                onPress={handleConfirmEdit}
                size="sm"
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  section: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: SPACING.md,
  },
  infoRow: { fontSize: SIZES.sm, color: COLORS.gray500, marginBottom: 4 },
  infoVal: { color: COLORS.gray800, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  halfBtn: { flex: 1 },
  notes: { fontSize: SIZES.sm, color: COLORS.gray600, fontStyle: 'italic', backgroundColor: COLORS.gray50, padding: SPACING.sm, borderRadius: RADIUS.md },
  productBlock: { marginBottom: SPACING.md },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  productName: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.gray800 },
  qty: { color: COLORS.primary, fontWeight: '700', fontSize: SIZES.sm },
  snRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  snText: { fontSize: SIZES.sm, color: COLORS.gray600, flex: 1 },
  snVerified: { color: COLORS.green },
  snActions: { flexDirection: 'row', gap: SPACING.xs },
  snEditBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.primary },
  snEditText: { fontSize: SIZES.xs, color: COLORS.primary },
  snVerifyBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.sm, backgroundColor: COLORS.primary },
  snVerifyText: { fontSize: SIZES.xs, color: COLORS.white },
  warning: { fontSize: SIZES.sm, color: COLORS.red, textAlign: 'center', marginBottom: SPACING.md },
  bottomActions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: SPACING.sm, padding: SPACING.lg,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray100,
  },
  bottomBtn: { flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.xl, width: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.primary },
  modalClose: { fontSize: 20, color: COLORS.gray400 },
  modalLabel: { fontSize: SIZES.sm, color: COLORS.gray600, marginBottom: SPACING.sm },
  modalActions: { flexDirection: 'row', gap: SPACING.sm },
  modalBtn: { flex: 1 },
});
