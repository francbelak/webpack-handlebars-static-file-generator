const deploy = require('./dist/deploy.settings.js');
let FtpDeploy = require('ftp-deploy');
let ftpDeploy = new FtpDeploy();

ftpDeploy.on('uploading', data => {
  console.info(data.transferredFileCount + '/' + data.totalFileCount + ' ' + data.percentComplete + '% Uploading: ' + data.filename);
});

ftpDeploy.deploy(deploy.settings, (err) => {
  if (err)
    console.info(err);
  else
    console.info('100% finished successfully');
});
