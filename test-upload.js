const fs = require('fs');

async function upload() {
  const fileContent = Buffer.from('test image content');
  const formData = new FormData();
  formData.append('file', new Blob([fileContent], { type: 'image/jpeg' }), 'test.jpg');

  try {
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

upload();
