export type Language = 'km' | 'en';

export const translations = {
  km: {
    brandTag: 'កម្ពុជា',
    appSubtitle: 'ស្កេនពិនិត្យកុងធនាគារ និងឈ្មោះម្ចាស់គណនី',
    btnCamera: 'កាមេរ៉ា',
    btnHistory: 'ប្រវត្តិ',
    pageTitle: 'ស្កេន QR ធនាគារ',
    pageSubtitle: 'អានទិន្នន័យ KHQR គ្រប់ធនាគារ (ABA, ACLEDA, Wing, Canadia...) ដោយស្វ័យប្រវត្តិនឹងបង្ហាញលេខគណនី និងឈ្មោះម្ចាស់បានត្រឹមត្រូវ',
    
    // Upload card
    uploadTitle: 'Upload QR Banking',
    uploadSubtitle: 'គាំទ្ររូបភាព PNG, JPG, WebP ឬ ចុចបិទភ្ជាប់ (Ctrl+V)',
    dropzoneLine1: 'ចុច ឬ ចម្លង (Paste) រូបភាព',
    dropzoneLine2: 'QR ទីនេះ',
    dropzoneHint: 'អូសទម្លាក់ (Drag & Drop) ឬ ចុច',
    changeQrImage: 'ចុចដើម្បីប្តូររូប QR ផ្សេង',
    scanning: 'កំពុងស្កេនទិន្នន័យ KHQR...',
    clearBtn: 'លុបព័ត៌មាន (Clear)',
    errorImageFile: 'សូមជ្រើសរើសឯកសាររូបភាព (PNG, JPG, WEBP...)',
    errorScanFailed: 'មិនអាចអាន QR Code នេះបានទេ! សូមព្យាយាមប្រើរូបភាពច្បាស់ជាងនេះ។',
    errorScanNotice: 'សូមប្រើប្រាស់រូបភាព QR កម្រិតច្បាស់ និងមិនមានស្រមោលបាំងខ្លាំង។',

    // Scan result card
    resultTitle: 'ព័ត៌មានគណនីធនាគារ (Account Details)',
    resultWaiting: 'រង់ចាំការស្កេនរូបភាព QR...',
    resultReady: 'ទិន្នន័យបានស្រង់ចេញពី KHQR ដោយត្រឹមត្រូវ',
    copySummary: 'ចម្លងសង្ខេប',
    copied: 'បានចម្លង',
    copy: 'ចម្លង',
    copiedDone: 'ចម្លងហើយ',
    accountIdLabel: 'លេខគណនី / Account ID',
    phoneTag: 'លេខទូរស័ព្ទ / Phone',
    altIdLabel: 'ជ្រើសរើសលេខសម្គាល់ផ្ទេរប្រាក់ផ្សេងទៀត៖',
    accountNameLabel: 'ឈ្មោះគណនី / Merchant Name',
    bankNameLabel: 'ធនាគារ / Bank Name',
    amountLabel: 'ចំនួនទឹកប្រាក់ / Amount',
    dynamicQr: 'Dynamic QR',
    allBanksSupport: 'គាំទ្រ KHQR គ្រប់ធនាគារក្នុងប្រទេសកម្ពុជា',
    emvcoNotice: 'EMVCo Standards',
    noName: 'អត់ឈ្មោះ',

    // Privacy section
    privacyTitle: 'សុវត្ថិភាព និងភាពឯកជន 100% (Client-Side Privacy)',
    privacyDesc: 'ដំណើរការអាន និងដោះកូដ KHQR ទាំងអស់ប្រព្រឹត្តទៅក្នុង Browser លើឧបករណ៍របស់អ្នកផ្ទាល់ ដោយមិនបញ្ជូនរូបភាព ឬទិន្នន័យគណនីធនាគារទៅកាន់ Server ណាមួយឡើយ។ កម្មវិធីគាំទ្រស្តង់ដារ EMVCo និង Bakong KHQR Specification របស់ធនាគារជាតិនៃកម្ពុជា (NBC)។',
    moreBanks: '+ 30+ ធនាគារផ្សេងទៀត',

    // Camera Modal
    cameraTitle: 'ស្កេនតាមកាមេរ៉ា (Live Camera)',
    cameraSwitch: 'ប្តូរកាមេរ៉ាមុខ/ក្រោយ',
    cameraBoxGuide: 'ដាក់ QR Code ក្នុងប្រអប់ដើម្បីស្កេន',
    cameraError: 'មិនអាចបើកកាមេរ៉ាបានទេ! សូមពិនិត្យសិទ្ធិអនុញ្ញាតកាមេរ៉ា (Permission) ក្នុង Browser របស់អ្នក។',
    cameraErrorAlt: 'អ្នកក៏អាច Upload រូបភាព ឬ ចុចបិទភ្ជាប់ (Paste) រូប QR វិញបានដែរ។',
    close: 'បិទ',

    // History Modal
    historyTitle: 'ប្រវត្តិស្កេន KHQR (Scan History)',
    historyCount: (count: number) => `បានរក្សាទុក ${count} គណនី`,
    historyEmpty: 'មិនទាន់មានប្រវត្តិស្កេននៅឡើយទេ',
    historyClearAll: 'លុបប្រវត្តិទាំងអស់',
    copyAccount: 'ចម្លងលេខគណនី',

    // Footer
    footerRights: 'រក្សាសិទ្ធិគ្រប់យ៉ាង។',
    footerScanHistory: 'ប្រវត្តិស្កេន',
    footerScanCamera: 'ស្កេនតាមកាមេរ៉ា',

    // Toast
    toastScanSuccess: (bank: string, name: string) => `ស្កេនជោគជ័យ៖ ${bank} - ${name}`,
    toastCleared: 'បានសម្អាតទិន្នន័យ',
    toastHistoryCleared: 'បានលុបប្រវត្តិស្កេនទាំងអស់',

    // Language Toggle
    langKhmer: 'ខ្មែរ',
    langEnglish: 'English'
  },
  en: {
    brandTag: 'Cambodia',
    appSubtitle: 'Scan & verify bank account and merchant name',
    btnCamera: 'Camera',
    btnHistory: 'History',
    pageTitle: 'Scan Banking QR',
    pageSubtitle: 'Automatically read KHQR codes from all Cambodian banks (ABA, ACLEDA, Wing, Canadia...) and display verified account ID and merchant name',

    // Upload card
    uploadTitle: 'Upload QR Banking',
    uploadSubtitle: 'Supports PNG, JPG, WebP or direct clipboard paste (Ctrl+V)',
    dropzoneLine1: 'Click or paste (Paste) image',
    dropzoneLine2: 'QR code here',
    dropzoneHint: 'Drag & drop or press',
    changeQrImage: 'Click to change QR image',
    scanning: 'Scanning KHQR data...',
    clearBtn: 'Clear Information (Clear)',
    errorImageFile: 'Please choose an image file (PNG, JPG, WEBP...)',
    errorScanFailed: 'Unable to decode this QR Code! Please try with a clearer image.',
    errorScanNotice: 'Please use a high-resolution QR image without strong glares or shadows.',

    // Scan result card
    resultTitle: 'Bank Account Details',
    resultWaiting: 'Waiting for QR image scan...',
    resultReady: 'Data successfully decoded from KHQR',
    copySummary: 'Copy Summary',
    copied: 'Copied',
    copy: 'Copy',
    copiedDone: 'Copied',
    accountIdLabel: 'Account ID / Number',
    phoneTag: 'Phone Number',
    altIdLabel: 'Select alternative transfer identifier:',
    accountNameLabel: 'Account Name / Merchant Name',
    bankNameLabel: 'Bank Name',
    amountLabel: 'Amount',
    dynamicQr: 'Dynamic QR',
    allBanksSupport: 'Supports all KHQR member banks in Cambodia',
    emvcoNotice: 'EMVCo Standards',
    noName: 'Unnamed',

    // Privacy section
    privacyTitle: '100% Private & Secure (Client-Side Privacy)',
    privacyDesc: 'All KHQR reading and decoding procedures take place strictly inside your local browser. No bank account information or images are sent to any remote server. Fully compliant with EMVCo standards and National Bank of Cambodia (NBC) Bakong KHQR specifications.',
    moreBanks: '+ 30+ other banks',

    // Camera Modal
    cameraTitle: 'Scan with Camera (Live Camera)',
    cameraSwitch: 'Switch front/back camera',
    cameraBoxGuide: 'Position QR Code within the frame to scan',
    cameraError: 'Cannot access camera! Please verify camera permissions in your browser.',
    cameraErrorAlt: 'You can also upload an image file or paste (Ctrl+V) a QR screenshot.',
    close: 'Close',

    // History Modal
    historyTitle: 'KHQR Scan History',
    historyCount: (count: number) => `Saved ${count} accounts`,
    historyEmpty: 'No scan history recorded yet',
    historyClearAll: 'Clear All History',
    copyAccount: 'Copy Account ID',

    // Footer
    footerRights: 'All rights reserved.',
    footerScanHistory: 'Scan History',
    footerScanCamera: 'Camera Scanner',

    // Toast
    toastScanSuccess: (bank: string, name: string) => `Scanned successfully: ${bank} - ${name}`,
    toastCleared: 'Data cleared',
    toastHistoryCleared: 'All scan history cleared',

    // Language Toggle
    langKhmer: 'ខ្មែរ',
    langEnglish: 'English'
  }
};
