/**
 * ฟังก์ชันหลักสำหรับ Deploy เป็น Web App
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setTitle('ระบบสร้าง QR Code เนื้อสัตว์');
}

/**
 * ฟังก์ชันสำหรับประมวลผลข้อมูลฟอร์มจากหน้าเว็บ
 * @param {object} formData ข้อมูลที่ส่งมาจากฟอร์ม
 * @return {object} ข้อมูลผลลัพธ์ รวมถึง URL ของ QR Code
 */
function processForm(formData) {
  const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEETS_ID';
  const SHEET_NAME = 'บันทึกรับเข้า';

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('ไม่พบชีท: ' + SHEET_NAME);
  }

  const timestamp = new Date().getTime(); // ได้ Timestamp 13 หลัก
  const receivedDate = formData.receivedDate;
  const meatType = formData.meatType;
  const weight = parseFloat(formData.weight);

  // บันทึกข้อมูลลงใน Google Sheets
  sheet.appendRow([
    timestamp,
    receivedDate,
    meatType,
    weight
  ]);

  // สร้าง QR Code URL จาก Timestamp
  const qrCodeUrl = `https://quickchart.io/qr?text=${timestamp}&size=300&light=FFFFFF&dark=E9C46A&ecLevel=H&format=svg`;
  
  return {
    qrCodeUrl: qrCodeUrl,
    meatType: meatType,
    weight: weight.toFixed(2),
    receivedDate: receivedDate
  };
}
