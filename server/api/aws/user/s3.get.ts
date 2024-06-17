import {
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: 'us-west-2' });

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let key = ''

    if (!event.fullKey) {
        const username = query?.name ? query.name : event.name
        key = `${username.replace(/\s/g, '-')}/checklist.json`
    } else {
        key = event.fullKey
    }

    const command = new GetObjectCommand({
        Bucket: "dopat-scavenger-hunt",
        Key: key,
    });

    try {
        const response = await s3Client.send(command);
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        const str = await response?.Body?.transformToString();
        const strJson = JSON.parse(str)

        if (event.fullKey) {
            const name = event.fullKey.split('/')[0].replace(/-/g, ' ')

            strJson.name = name
        }

        return strJson
    } catch (err) {
        console.error(err);
        return {
            error: err
        }
    }

})
