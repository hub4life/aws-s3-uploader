
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');


const app = express();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const s3 = new AWS.S3();

app.post('/upload', upload.single('file'), (req, res) => {
if (!req.file) {
return res.status(400).send('Aucun fichier téléchargé.');
}


const params = {
Bucket: 'week4-fatou',
Key: req.file.originalname,
Body: req.file.buffer,
ContentType: req.file.mimetype,
};

s3.upload(params, (err, data) => {
if (err) {
console.error('Erreur lors de l\'upload :', err);
return res.status(500).send('Erreur lors de l\'upload du fichier.');
}
res.send(`Fichier uploadé avec succès : ${data.Location}`);
});
});


const port = 3000;
app.listen(port, () => {
console.log(`Serveur démarré sur http://localhost:${port}`);
});

app.post('/upload', upload.single('file'), (req, res) => {
console.log('Requête reçue pour /upload');
if (!req.file) {
console.log('Aucun fichier trouvé dans la requête');
return res.status(400).send('Aucun fichier téléchargé');
}

console.log('Fichier reçu:', req.file);

});
app.get('/files', async (req, res) => {
const s3 = new AWS.S3();

const params = {
Bucket: 'week4-fatou'
};

try {
const data = await s3.listObjectsV2(params).promise();
const files = data.Contents.map(file => file.Key);
res.json({ files });
} catch (err) {
console.error('Error retrieving files: ', err);
res.status(500).json({ error: 'Failed to retrieve files from S3' });
}
});

const path = require('path');

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/files', async (req, res) => {
const s3 = new AWS.S3();

const params = {
Bucket: 'week4-fatou'
};

try {
const data = await s3.listObjectsV2(params).promise();
const files = data.Contents.map(file => ({
key: file.Key,
url: `https://${params.Bucket}.s3.amazonaws.com/${encodeURIComponent(file.Key)}`
}));
res.json(files);
} catch (err) {
console.error('Erreur lors de la récupération des fichiers :', err);
res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
}
});
