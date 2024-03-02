import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    // return { body }

    let buf = Buffer.from(body.photo.replace(/^data:image\/\w+;base64,/, ""), 'base64')

    const command = new PutObjectCommand({
        Bucket: "dopat-scavenger-hunt",
        Key: `table-1/test.jpg`,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    });

    try {
        const response = await s3Client.send(command);
        console.log(response);
        return 'success'
    } catch (err) {
        console.error(err);
        return `fail error: ${err}`
    }
})