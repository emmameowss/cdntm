import express from "express";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import "dotenv/config";

const app = express()
app.use(cors())
app.use(express.static("public"))

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
})

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET,
        acl: 'public-read',
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            const name = path.basename(file.originalname, ext)
            cb(null, `${name} (${randomUUID()})${ext}`)
        },
    }),
    limits: {fileSize: 15 * 1024 * 1024}
})

