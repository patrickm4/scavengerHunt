import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

export default defineEventHandler(async (event) => {
    console.log("running create user1")
    const body = await readBody(event)

    console.log("running create user2", body, body.name.replace(/\s/g, '-'))

    const command = new PutObjectCommand({
        Bucket: "dopat-scavenger-hunt",
        Key: `${body.name.replace(/\s/g, '-')}/checklist.json`,
        Body: JSON.stringify({
            task: "task1",
            task2: "task2"
        }),
        ContentType: "application/json"
    });

    try {
        const response = await s3Client.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
    } finally {
        return 'test aws api complete'
    }

})
