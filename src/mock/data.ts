import { Job, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Somchai Driver',
  email: 'driver@sunmith.com',
  phone: '063-516-1293',
  role: 'driver',
};

export const mockJobs: Job[] = [
  {
    id: '1',
    jobNo: 'JOB-180226-0001',
    dueDate: '17/02/2026',
    dueTime: '10:30 PM',
    status: 'กำลังโปรับของ',
    warehouse: {
      name: 'คลังสินค้า SunmiTH',
      code: 'Sunmi HQ (บางนา)',
      address: '459 ถ. เทพรัตน แขวงบางนาเหนือ เขตบางนา กรุงเทพมหานคร 10260',
    },
    customer: {
      storeName: 'ร้านกาแฟ อาราบิก้า',
      contactName: 'คุณลูกค้า A',
      phone: '063-516-1293',
      invoiceNo: 'RE-123-456',
    },
    installLocation: {
      address: '459 ถ. เทพรัตน แขวงบางนาเหนือ เขตบางนา กรุงเทพมหานคร 10260',
      subDistrict: 'บางนาเหนือ',
      district: 'บางนา',
      province: 'กรุงเทพมหานคร',
    },
    products: [
      {
        id: 'p1',
        name: 'SUNMI V3',
        quantity: 2,
        serialNumbers: [
          { sn: 'V3P-333-111', verified: true, installed: false },
          { sn: 'V3P-333-222', verified: false, installed: false },
        ],
      },
      {
        id: 'p2',
        name: 'SUNMI D3 PRO',
        quantity: 1,
        serialNumbers: [
          { sn: 'D3P-333-222', verified: false, installed: false },
        ],
      },
    ],
    notes: '"ระวังหนุมาก เข้าประตูด้านหลังเท่านั้น"',
    inspectionForms: [
      {
        productId: 'p1',
        productName: 'SUNMI V3',
        sn: 'V3P-333-111',
        checklist: [
          { id: 'c1', label: 'เปิดเครื่องได้ เครื่องต่อ WIFI / อินเตอร์เน็ต', checked: false },
          { id: 'c2', label: 'หน้าจอสว่างและแสดงผลปกติ', checked: false },
          { id: 'c3', label: 'ทดสอบเครื่องพิมพ์', checked: false },
          { id: 'c4', label: 'ทดสอบแสกนเนอร์ (สาขา/ร้าน)', checked: false },
        ],
        photos: [],
        notes: '',
      },
    ],
  },
  {
    id: '2',
    jobNo: 'JOB-180226-0001',
    dueDate: '17/02/2026',
    dueTime: '10:30 PM',
    status: 'รอรับของ',
    warehouse: {
      name: 'คลังสินค้า SunmiTH',
      code: 'Sunmi HQ (บางนา)',
      address: '459 ถ. เทพรัตน แขวงบางนาเหนือ เขตบางนา กรุงเทพมหานคร 10260',
    },
    customer: {
      storeName: 'ร้านกาแฟ อาราบิก้า',
      contactName: 'คุณลูกค้า B',
      phone: '063-516-1294',
      invoiceNo: 'RE-123-457',
    },
    installLocation: {
      address: '459 ถ. เทพรัตน แขวงบางนาเหนือ เขตบางนา กรุงเทพมหานคร 10260',
      subDistrict: 'บางนาเหนือ',
      district: 'บางนา',
      province: 'กรุงเทพมหานคร',
    },
    products: [
      {
        id: 'p3',
        name: 'SUNMI V3',
        quantity: 2,
        serialNumbers: [
          { sn: 'V3P-444-111', verified: false, installed: false },
          { sn: 'V3P-444-222', verified: false, installed: false },
        ],
      },
      {
        id: 'p4',
        name: 'SUNMI D3 PRO',
        quantity: 1,
        serialNumbers: [
          { sn: 'D3P-444-222', verified: false, installed: false },
        ],
      },
    ],
    notes: '"ระวังหนุมาก เข้าประตูด้านหลังเท่านั้น"',
    inspectionForms: [],
  },
];