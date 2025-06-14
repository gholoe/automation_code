const { exec } = require('child_process');

function run(command) {
  return new Promise((resolve, reject) => {
    const proc = exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      // Always resolve, so it doesn't stop even if there are errors
      resolve();
    });
  });
}

(async () => {
  console.log('🧹 Cleaning old screenshots...');
  await run('npm run clean:customhtml');

  console.log('🚀 Running WebdriverIO tests...');
  await run('wdio run ./wdio.conf.js');

  console.log('📝 Generating custom HTML report...');
  await run('npm run generate:html');

  console.log('📝 Generating custom PDF report...');
  await run('npm run generate:pdf');
})();
