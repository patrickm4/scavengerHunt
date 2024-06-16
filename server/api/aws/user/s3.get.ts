import {
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: 'us-west-2' });

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    console.log("running get user json1", query)
    if (event.name) {
        console.log("running get user json2 check event", event)
    }

    const keyName = query?.name ? query.name : event.name

    const command = new GetObjectCommand({
        Bucket: "dopat-scavenger-hunt",
        Key: `${keyName.replace(/\s/g, '-')}/checklist.json`,
    });

    try {
        const response = await s3Client.send(command);
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        const str = await response.Body.transformToString();
        return str
    } catch (err) {
        console.error(err);
        return {
            error: err
        }
    }

})
