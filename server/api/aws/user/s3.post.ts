import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: 'us-west-2' });

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const command = new PutObjectCommand({
        Bucket: "dopat-scavenger-hunt",
        Key: `${body.name.replace(/\s/g, '-')}/checklist.json`,
        Body: JSON.stringify({
            completedTasks: {},
        }),
        ContentType: "application/json"
    });

    try {
        const response = await s3Client.send(command);
        return {
            ok: true, userJson: {
                completedTasks: {},
            }
        }
    } catch (err) {
        console.error(err);
        return {
            error: `${err}`
        }
    }

})
