// const fs = require('fs');
// const path = require('path');

// const resultsDir = path.join(__dirname, '../allure-results');
// const attachmentsDir = path.join(__dirname, '../custom-html/attachments');
// const outputDir = path.join(__dirname, '../custom-html');
// const htmlPath = path.join(outputDir, 'report.html');

// if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
// if (!fs.existsSync(attachmentsDir)) fs.mkdirSync(attachmentsDir);

// let total = 0, passed = 0, failed = 0;

// let html = [`
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>Custom Report</title>
//   <style>
//     body { font-family: Arial, sans-serif; }
//     h1 { color: #333; }
//     .summary { background: #f4f4f4; padding: 10px; margin-bottom: 20px; }
//     .test { border-bottom: 1px solid #ccc; margin-bottom: 20px; padding-bottom: 10px; }
//     .PASSED { background-color: #e0f9e0; padding: 5px; }
//     .FAILED { background-color: #ffe0e0; padding: 5px; }
//     .timestamp { font-size: 0.9em; color: #666; }
//   </style>
// </head>
// <body>
//   <h1>Test Report</h1>
// `];

// const testBlocks = [];

// fs.readdirSync(resultsDir).forEach(file => {
//     if (file.endsWith('-result.json')) {
//         const result = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
//         const name = result.name || 'Unnamed Test';
//         const status = result.status ? result.status.toUpperCase() : 'UNKNOWN';
//         const start = result.start || Date.now();
//         const stop = result.stop || start;
//         const durationSec = ((stop - start) / 1000).toFixed(2);
//         const date = new Date(start).toLocaleString();

//         total++;
//         if (status === 'PASSED') passed++;
//         else if (status === 'FAILED') failed++;

//         const block = [`
//     <div class="test ${status}">
//       <h2>${name}</h2>
//       <p>Status: <strong>${status}</strong></p>
//       <p class="timestamp">Started: ${date} | Duration: ${durationSec} seconds</p>
//     `];

//         // if (result.attachments) {
//         //   result.attachments.forEach(att => {
//         //     if (att.source && att.source.endsWith('.png')) {
//         //       const srcPath = path.join(resultsDir, att.source);
//         //       const destPath = path.join(attachmentsDir, att.source);
//         //       if (fs.existsSync(srcPath)) {
//         //         fs.copyFileSync(srcPath, destPath);
//         //         block.push(`<img src="attachments/${att.source}" width="400"/><br>`);
//         //       }
//         //     }
//         //   });
//         // }

//         const logFile = path.resolve(__dirname, '../custom-html/attachments/log.txt');
//         const logEntries = fs.existsSync(logFile)
//             ? fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean)
//             : [];

//         const relatedScreenshots = logEntries.filter(line => line.includes(name));

//         relatedScreenshots.forEach(entry => {
//             const [, fileName] = entry.split('|').map(s => s.trim());
//             const srcPath = path.join(__dirname, '../custom-html/attachments', fileName);
//             const destPath = path.join(attachmentsDir, fileName);

//             if (fs.existsSync(srcPath)) {
//                 block.push(`<img src="attachments/${fileName}" width="400"/><br>`);
//             }
//         });


//         block.push('</div>');
//         testBlocks.push(block.join('\n'));
//     }
// });

// html.push(`
// <div class="summary">
//   <h2>Summary</h2>
//   <p><strong>Total:</strong> ${total}</p>
//   <p><strong>Passed:</strong> ${passed}</p>
//   <p><strong>Failed:</strong> ${failed}</p>
// </div>
// `);

// html = html.concat(testBlocks);
// html.push('</body></html>');

// fs.writeFileSync(htmlPath, html.join('\n'), 'utf8');
// console.log(`✅ Custom HTML report with summary created at: ${htmlPath}`);


const fs = require('fs');
const path = require('path');

const attachmentsDir = path.join(__dirname, '../custom-html/attachments');
const outputDir = path.join(__dirname, '../custom-html');
const htmlPath = path.join(outputDir, 'report.html');
const logPath = path.join(attachmentsDir, 'log.txt');

// Pastikan folder output ada
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
if (!fs.existsSync(attachmentsDir)) fs.mkdirSync(attachmentsDir);

// const logEntries = fs.existsSync(logPath)
//     ? fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean)
//     : [];
const logEntries = fs.existsSync(logPath)
  ? fs.readFileSync(logPath, 'utf8').replace(/\\n/g, '\n').split('\n').filter(Boolean)
  : [];


let total = 0, passed = 0, failed = 0;
const testBlocks = [];

let html = [`
<html>
<head>
  <meta charset="UTF-8">
  <title>Custom Report</title>
  <style>
    body { font-family: Arial, sans-serif; }
    h1 { color: #333; }
    .summary { background: #f4f4f4; padding: 10px; margin-bottom: 20px; }
    .test { border-bottom: 1px solid #ccc; margin-bottom: 20px; padding-bottom: 10px; }
    .PASSED { background-color: #e0f9e0; padding: 5px; }
    .FAILED { background-color: #ffe0e0; padding: 5px; }
    .timestamp { font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <h1>Test Report</h1>
`];

// Proses log.txt
logEntries.forEach(entry => {
  const parts = entry.split('|').map(p => p.trim());
  if (parts.length < 3) return;

  const [stepName, fileName, status] = parts;
  const statusUpper = status.toUpperCase();

  total++;
  if (statusUpper === 'PASSED') passed++;
  else if (statusUpper === 'FAILED') failed++;

  const imagePath = `attachments/${fileName}`;
  const block = `
    <div class="test ${statusUpper}">
      <h2>${stepName}</h2>
      <p>Status: <strong>${statusUpper}</strong></p>
      <img src="${imagePath}" width="400"/><br>
    </div>
  `;
  testBlocks.push(block);
});

// Summary block
html.push(`
<div class="summary">
  <h2>Summary</h2>
  <p><strong>Total:</strong> ${total}</p>
  <p><strong>Passed:</strong> ${passed}</p>
  <p><strong>Failed:</strong> ${failed}</p>
</div>
`);

html = html.concat(testBlocks);
html.push('</body></html>');

fs.writeFileSync(htmlPath, html.join('\n'), 'utf8');
console.log(`✅ Custom HTML report created at: ${htmlPath}`);

