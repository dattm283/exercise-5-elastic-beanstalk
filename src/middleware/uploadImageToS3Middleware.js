import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    credentials: {
        accessKeyId: "AKIA55LG67TMINAMNEOV",
        secretAccessKey: "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",
    },
    region: "us-east-1"
})

const s3Storage = multerS3({
    s3: s3,
    bucket: "user3104036project2bucket", 
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

// our middleware
const uploadImage = multer({
    storage: s3Storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb file size
    }
})

export default uploadImage;