import {
    S3Client,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";

interface Photo {
    fileb64String: string;
    name: string;
    type: string;
    size: number;
}

const s3Client = new S3Client({});

export default defineEventHandler(async (event) => {
    // const body = await readBody(event)

    // return { body }

    try {

        const command = new ListObjectsV2Command({
            Bucket: "dopat-scavenger-hunt",
        });

        const response = await s3Client.send(command)

        console.log("checkkk", response)

        return response

    } catch (err) {
        console.error(err);
        return `fail error: ${err}`
    }
})