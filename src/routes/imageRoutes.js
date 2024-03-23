import express from "express";
import uploadImage from "../middleware/uploadImageToS3Middleware.js";
import { filterImageFromURL,filterImageFromURLS3, deleteLocalFiles } from '../util/util.js';

export const router = express.Router();

router.post("/images/", uploadImage.single('file'), async (req, res) => {
    if(req.file){
        res.status(201).json({url: req.file.location});
    } else {
        console.error('S3 upload failed', req)
        res.status(500).send('Image upload failed')
    }
});

router.get('/filteredimage', async (req, res) => {
    let { image_url } = req.query;

    try {
        if (!image_url) {
            return res.status(400).json({ error: 'image_url query parameter is required' });
        }

        const filteredImagePath = await filterImageFromURL(image_url);
        console.log("filteredImagePath", filteredImagePath);
        res.status(200).sendFile(filteredImagePath);
    } catch (error) {
        console.error('Error filtering image:', error);
        res.status(500).json({ error: 'Error filtering image' });
    }
});