const express = require('express');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const router = express.Router();
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadFileToS3 = (key, body) =>
  s3.upload({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: body
  }).promise();

router.get('/data', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0]; // e.g. 2025-07-14
    const basePath = path.join(__dirname, '..', 'data');

    const filesToUpload = [
      { name: 'clients.json', label: 'Clients' },
      { name: 'claims.json', label: 'Claims' },
      { name: 'documents.json', label: 'Documents' }
    ];

    const results = [];

    for (let file of filesToUpload) {
      const fullPath = path.join(basePath, file.name);
      const fileBuffer = fs.readFileSync(fullPath);
      const s3Key = `backup/${timestamp}/${file.name}`;

      const uploadResult = await uploadFileToS3(s3Key, fileBuffer);
      results.push({ label: file.label, url: uploadResult.Location });
    }

    res.send(`<h2>✅ Backup Complete</h2><ul>${results.map(r => `<li>${r.label}: <a href="${r.url}" target="_blank">View</a></li>`).join('')}</ul>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Backup failed.');
  }
});

module.exports = router;
