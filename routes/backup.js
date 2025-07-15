const express = require('express');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const router = express.Router();
require('dotenv').config(); // Load .env credentials

// ✅ Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// ✅ Utility: Upload file buffer to S3
const uploadFileToS3 = (key, body) => {
  return s3.upload({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: body
  }).promise();
};

// ✅ Route: /backup/data
router.get('/data', async (req, res) => {
  try {
    const dateFolder = new Date().toISOString().split('T')[0]; // e.g. 2025-07-15
    const dataDir = path.join(__dirname, '..', 'data');

    const files = [
      { name: 'clients.json', label: 'Clients' },
      { name: 'claims.json', label: 'Claims' },
      { name: 'documents.json', label: 'Documents' }
    ];

    const uploaded = [];

    for (let file of files) {
      const filePath = path.join(dataDir, file.name);
      const fileBuffer = fs.readFileSync(filePath);
      const s3Key = `backup/${dateFolder}/${file.name}`;

      const result = await uploadFileToS3(s3Key, fileBuffer);
      uploaded.push({ label: file.label, url: result.Location });
    }

    res.send(`
      <h2>✅ Backup Complete</h2>
      <ul>
        ${uploaded.map(f => `<li>${f.label}: <a href="${f.url}" target="_blank">View on S3</a></li>`).join('')}
      </ul>
    `);
  } catch (err) {
    console.error('❌ Backup Error:', err);
    res.status(500).send('❌ Backup failed. Check console for details.');
  }
});

module.exports = router;
