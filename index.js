import express from 'express';
import fileUpload from 'express-fileupload';
import { uploadFile, getFiles, getFile, downloadFile, getFileUrl } from './s3.js';

const app = express();

// Midelware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));

// List all files
app.get('/files', async (_, res) => {
    const result = await getFiles();
    res.json({ files: result.Contents });
});

// List one file
app.get('/files/:fileName', async (req, res) => {
    const result = await getFileUrl(req.params.fileName);
    res.json({ url: result });
});

// Download one file
app.get('/download/:fileName', async (req, res) => {
    await downloadFile(req.params.fileName);
    res.json({ message: 'File downloaded' });
});

// Upload file
app.post('/files', async (req, res) => {
    console.log(req.files);
    const result = await uploadFile(req.files.file);
    res.json({ result });
});

// See the file in the browser
app.use(express.static('downloads'));

app.listen(3000)
console.log('Server running on port 3000');