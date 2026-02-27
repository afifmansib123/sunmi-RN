### Lesson 10 - All Frontend Screens ###

## This is a very important commit - ill be pushing the initial pages with minimum design. ine tune later ##

## src/screens/jobs/JobListScreen.tsx

Data source: Redux jobsSlice (mock data for now)

UI layout:
  - Header: "งานทั้งหมด" + avatar circle (first letter of name)
  - Filter pill showing job count
  - FlatList of job cards

Each job card shows:
  - Job number + StatusBadge
  - Due date
  - Warehouse section (icon, name, code)
  - Customer section (store name, phone)
  - Products section (list with quantities)
  - Two action buttons depending on status

Button logic:
  - Status 'กำลังโปรับของ' → "ติดต่อคลัง" + "นำทาง"
  - Status 'รอรับของ'       → "ดูรายละเอียด" + "โปรับสินค้า"

On press:
  dispatch(setSelectedJob(job))
  navigate to JobDetail


## src/screens/jobs/JobDetailScreen.tsx

Route param: jobId
Gets job from Redux: jobs.find(j => j.id === jobId)

Has TWO views in same screen depending on status:

View 1 - Normal detail (status = 'รอรับของ'):
  - Orange job banner (jobNo + date + status badge)
  - Warehouse section (address, map button, call button)
  - Customer section (name, phone, invoice)
  - Install location section
  - Products list
  - Notes
  - Bottom: "กลับหน้าหลัก" + "โปรับสินค้า" → goes to Pickup

View 2 - In transit (status = 'กำลังเดินทาง'):
  - Same banner
  - Customer section
  - Install location section
  - Products list with verified S/N shown
  - Bottom: "กลับหน้าหลัก" + "ถึงหน้าร้านแล้ว" → goes to Install




## src/screens/jobs/JobPickupScreen.tsx

Purpose: verify each serial number before taking products from warehouse

State (local):
  editModal: { visible, productId, productName, sn, inputSn }

UI:
  - Job banner
  - Warehouse info
  - Notes
  - Products section with S/N rows:
      Each S/N row: "(S/N) V3P-333-111 ✓" + Edit button + Verify button
      If verified: green text, no Verify button
  - Warning text if not all verified
  - Bottom: "กลับหน้าหลัก" + "ยืนยันรับของ" (disabled until all verified)

Modal (Edit S/N):
  - Product name in orange header
  - Text input for S/N
  - Cancel + Confirm buttons

On confirm pickup:
  dispatch(updateJobStatus({ jobId, status: 'กำลังเดินทาง' }))
  navigate back to JobDetail (which now shows in-transit view)

  
## src/screens/jobs/JobInstallScreen.tsx

Purpose: run installation checklist for each device

State (local):
  checks: { [snKey]: { [checkId]: boolean } }
  selectedItem: { productId, sn } | null

UI:
  - Job banner
  - Customer info
  - Install location
  - Products section:
      Each S/N row: "(S/N) x" + Edit button + status chip
      Status chip: "ยังไม่ติดตั้ง" (gray) or "ติดตั้งแล้ว" (green)
      Tap Edit to expand checklist below

Expanded checklist (when item selected):
  Section 1: box photos (upload placeholder)
  Section 2: 4 checkboxes (wifi, screen, printer, scanner)
  Section 3: summary photos
  Confirm button

Logic:
  snKey = productId + "_" + sn
  isSnInstallDone = all 4 checkboxes checked for that snKey
  installedCount = count of done items
  allDone = installedCount === total items

Bottom: "กลับหน้าหลัก" + "สรุปและปิดงาน" (disabled until allDone)
On summary:
  dispatch(updateJobStatus({ jobId, status: 'รอลูกค้าเซ็น' }))
  navigate to JobSign


## src/screens/jobs/JobSignScreen.tsx

Purpose: get customer signature + receiver name to close job

State (local):
  receiverName: string
  signed: boolean

UI:
  - Job banner
  - Action list (all devices shown as completed with green ticks)
  - Customer signature box:
      Dashed border box, tap it to "sign" (sets signed = true)
      When signed: green solid border + "✓ ลงนามแล้ว" text
      Clear button below
  - Receiver name text input
  - Bottom: "กลับหน้าหลัก" + "ยืนยันและปิดงาน"
      Button disabled until signed AND receiverName filled

On confirm:
  dispatch(updateJobSignOff({ jobId, signature: 'signed', receiverName }))
  navigate to JobSuccess



## src/screens/jobs/JobSuccessScreen.tsx

Simple centered card:
  - Green circle with checkmark 
  - "ปิดงานสำเร็จ!" in green
  - Subtitle text
  - "กลับไปยังหน้าหลัก" button → navigate to JobList


## src/screens/profile/ProfileScreen.tsx

UI:
  - Pink avatar circle with first letter
  - Name + role
  - Info card: email, phone, role
  - Red outline logout button

Logout logic:
  1. Shows Alert confirmation
  2. Calls POST /auth/logout API (clears server cookies)
  3. Even if API fails, dispatches logout() to Redux
  4. Redux sets isAuthenticated = false
  5. AppNavigator sees this and shows LoginScreen