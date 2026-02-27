import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { updateJobSignOff } from '../../state/slices/jobsSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Button } from '../../components/common/Button';
import { COLORS, SIZES, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  navigation: any;
  route: any;
}

export const JobSignScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { jobId } = route.params;
  const job = useAppSelector((state) => state.jobs.jobs.find((j) => j.id === jobId));
  const [receiverName, setReceiverName] = useState('');
  const [signed, setSigned] = useState(false);

  if (!job) return null;

  const handleConfirm = () => {
    if (!signed) {
      Alert.alert('ยังไม่มีลายเซ็น', 'กรุณาให้ลูกค้าเซ็นชื่อก่อน');
      return;
    }
    if (!receiverName.trim()) {
      Alert.alert('ต้องระบุชื่อ', 'กรุณากรอกชื่อผู้รับงาน');
      return;
    }
    dispatch(updateJobSignOff({ jobId: job.id, signature: 'signed', receiverName }));
    navigation.navigate('JobSuccess', { jobId: job.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>สรุปและปิดงาน (Sign-off)</Text>
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

        {/* Action list (all completed) */}
        <View style={styles.section}>
          <SectionHeader
            icon="📋"
            title="รายการที่ดำเนินการ"
            rightText={`(${job.products.reduce((s,p)=>s+p.quantity,0)}/${job.products.reduce((s,p)=>s+p.quantity,0)} เสร็จแล้ว)`}
            rightColor={COLORS.green}
          />
          {job.products.map((product, pIdx) => (
            <View key={product.id} style={styles.productBlock}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{pIdx + 1}. {product.name}</Text>
                <Text style={styles.qty}>จำนวน x{product.quantity}</Text>
              </View>
              {product.serialNumbers.map((sn) => (
                <View key={sn.sn} style={styles.snRow}>
                  <Text style={styles.snText}>(S/N) {sn.sn} ✓</Text>
                  <Text style={styles.snStatus}>ดำเนินการเสร็จสิ้น</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Customer signature */}
        <View style={styles.section}>
          <SectionHeader icon="✍️" title="ลายเซ็นลูกค้า" />
          <TouchableOpacity
            style={[styles.signatureBox, signed && styles.signatureBoxSigned]}
            onPress={() => setSigned(true)}
            activeOpacity={0.7}
          >
            {signed ? (
              <View style={styles.signedContent}>
                <Text style={styles.signedText}>✓ ลงนามแล้ว</Text>
              </View>
            ) : (
              <Text style={styles.signaturePlaceholder}>✍️ เซ็นลายเซ็นของลูกค้า</Text>
            )}
          </TouchableOpacity>
          {signed && (
            <TouchableOpacity onPress={() => setSigned(false)} style={styles.clearSignBtn}>
              <Text style={styles.clearSignText}>🗑 ล้างลายเซ็น</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Receiver name */}
        <View style={styles.section}>
          <SectionHeader icon="👤" title="ชื่อผู้รับงาน" />
          <TextInput
            style={styles.nameInput}
            value={receiverName}
            onChangeText={setReceiverName}
            placeholder="กรอกชื่อผู้รับ"
            placeholderTextColor={COLORS.gray400}
          />
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <Button title="กลับหน้าหลัก" onPress={() => navigation.goBack()} variant="outline" size="md" style={styles.bottomBtn} />
        <Button
          title="📋 ยืนยันและปิดงาน"
          onPress={handleConfirm}
          size="md"
          disabled={!signed || !receiverName.trim()}
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
  headerTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.primary },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  jobBanner: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bannerJobNo: { color: COLORS.white, fontWeight: '700', fontSize: SIZES.lg },
  bannerDate: { color: 'rgba(255,255,255,0.8)', fontSize: SIZES.sm, marginTop: 2 },
  section: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  productBlock: { marginBottom: SPACING.md },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  productName: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.gray800 },
  qty: { color: COLORS.primary, fontWeight: '700', fontSize: SIZES.sm },
  snRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  snText: { fontSize: SIZES.sm, color: COLORS.green },
  snStatus: { fontSize: SIZES.xs, color: COLORS.green },
  signatureBox: {
    height: 120, borderWidth: 2, borderColor: COLORS.gray200, borderRadius: RADIUS.md,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.gray50,
  },
  signatureBoxSigned: { borderColor: COLORS.green, backgroundColor: COLORS.greenLight, borderStyle: 'solid' },
  signedContent: { alignItems: 'center' },
  signedText: { fontSize: SIZES.lg, color: COLORS.green, fontWeight: '700' },
  signaturePlaceholder: { color: COLORS.gray400, fontSize: SIZES.md },
  clearSignBtn: { marginTop: SPACING.sm, alignSelf: 'flex-start' },
  clearSignText: { fontSize: SIZES.sm, color: COLORS.red },
  nameInput: {
    borderWidth: 1.5, borderColor: COLORS.gray200, borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md, height: 48, fontSize: SIZES.md, color: COLORS.gray800,
  },
  bottomActions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: SPACING.sm, padding: SPACING.lg,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray100,
  },
  bottomBtn: { flex: 1 },
});
