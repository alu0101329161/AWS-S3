import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_REGION, AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME } from './config.js';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs';

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export async function uploadFile(file) {
    // Read content from the file
    const stream  =  fs.createReadStream(file.tempFilePath);
    // Setting up S3 upload parameters
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    }
    // Uploading files to AWS
    const command = new PutObjectCommand(uploadParams)
    return await client.send(command)
}

export async function getFiles() {
    // List all objects in the bucket
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    });
    return await client.send(command);
}

export async function getFile(fileName) {
    // List one object in the bucket
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    });
    return await client.send(command);
}

export async function getFileUrl(fileName) {
    // List one object in the bucket
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function downloadFile(fileName) {
    // List one object in the bucket
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    });
    const result = await client.send(command);
    // Download file and save it locally
    result.Body.pipe(fs.createWriteStream(`./downloads/${fileName}`));
}