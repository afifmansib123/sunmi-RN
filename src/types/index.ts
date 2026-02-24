export type JobStatus =
  | 'กำลังโปรับของ'
  | 'รอรับของ'
  | 'กำลังเดินทาง'
  | 'มีปัญหา'
  | 'กำลังติดตั้ง'
  | 'รอลูกค้าเซ็น'
  | 'ดำเนินการแล้ว';

export type RestartReason =
  | 'กรอกหมายเลขเครื่อง (S/N) ผิด'
  | 'พบความเสียหายของสินค้า'
  | 'เลือกสินค้า/รายการผิด'
  | 'ต้องแก้ไขข้อมูลลูกค้าก่อนเริ่มรับงาน'
  | 'จำนวนสินค้าไม่ตรงกับในใบเสร็จงาน'
  | 'อื่น ๆ (ระบุเพิ่มเติม)';

export type CancelReason =
  | 'ติดต่อลูกค้าประสานงานไม่ได้'
  | 'ลูกค้าไม่พร้อมรับบริการ'
  | 'เลือกสินค้า/รายการผิด'
  | 'สถานที่ติดตั้งไม่พร้อมดำเนินงาน'
  | 'ลูกค้าแจ้งเลื่อน/ยกเลิกงาน'
  | 'อื่น ๆ (ระบุเพิ่มเติม)';

export interface SerialNumber {
  sn: string;
  verified: boolean;   // SN scanned/entered at pickup
  installed: boolean;  // installation form submitted
}

export interface JobProduct {
  id: string;
  name: string;
  quantity: number;
  serialNumbers: SerialNumber[];
}

export interface Warehouse {
  name: string;
  code: string;
  address: string;
}

export interface Customer {
  storeName: string;
  contactName: string;
  phone: string;
  invoiceNo: string;
}

export interface InstallLocation {
  address: string;
  subDistrict: string;
  district: string;
  province: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface InspectionForm {
  productId: string;
  productName: string;
  sn: string;
  checklist: ChecklistItem[];
  notes: string;
  photos: string[]; // base64 or URLs
}

export interface Job {
  id: string;
  jobNo: string;
  dueDate: string;
  dueTime: string;
  status: JobStatus;
  warehouse: Warehouse;
  customer: Customer;
  installLocation: InstallLocation;
  products: JobProduct[];
  notes: string;
  inspectionForms: InspectionForm[];
  customerSignature?: string;
  receiverName?: string;
  restartReason?: RestartReason;
  restartReasonNote?: string;
  cancelReason?: CancelReason;
  cancelReasonNote?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}