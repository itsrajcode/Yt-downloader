import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';

const app = express();
app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('Invalid URL');
        }
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoURL, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('An error occurred while downloading the video.');
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
