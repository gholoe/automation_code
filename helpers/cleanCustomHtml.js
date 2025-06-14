const fs = require('fs');
const path = require('path');

const attachmentsDir = path.join(__dirname, '../custom-html/attachments');
const logPath = path.join(attachmentsDir, 'log.txt');
const reportHtmlPath = path.join(__dirname, '../custom-html/report.html');
const videoDir = path.join(__dirname, '../videos'); // 👈 Folder video

// Hapus semua file di dalam folder attachments
if (fs.existsSync(attachmentsDir)) {
  fs.readdirSync(attachmentsDir).forEach(file => {
    const filePath = path.join(attachmentsDir, file);
    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
} else {
  fs.mkdirSync(attachmentsDir, { recursive: true });
}

// Reset log.txt
fs.writeFileSync(logPath, '', 'utf8');

// Hapus report.html jika ada
if (fs.existsSync(reportHtmlPath)) {
  fs.unlinkSync(reportHtmlPath);
  console.log('✅ report.html dihapus.');
}

// Hapus semua file di dalam folder videos
if (fs.existsSync(videoDir)) {
  fs.readdirSync(videoDir).forEach(file => {
    const filePath = path.join(videoDir, file);
    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
  console.log('✅ Semua video dihapus.');
} else {
  fs.mkdirSync(videoDir, { recursive: true });
  console.log('📁 Folder video dibuat karena belum ada.');
}

console.log('✅ Folder attachments dibersihkan dan log.txt direset.');
