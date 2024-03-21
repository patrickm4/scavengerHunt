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
        // const responses = await Promise.allSettled(body.photos.map((photo: Photo) => {
        //     const buf = Buffer.from(photo.fileb64String.replace(/^data:image\/\w+;base64,/, ""), 'base64')

        //     const command = new PutObjectCommand({
        //         Bucket: "dopat-scavenger-hunt",
        //         Key: `table-1/${photo.name}`,
        //         Body: buf,
        //         ContentEncoding: 'base64',
        //         ContentType: 'image/jpeg'
        //     });

        //     return s3Client.send(command)
        // }))

        // return responses

        const command = new ListObjectsV2Command({
            Bucket: "dopat-scavenger-hunt",
            Prefix: 'table-1'
        });

        const response = await s3Client.send(command)

        console.log("checkkk", response)

        return response

    } catch (err) {
        console.error(err);
        return `fail error: ${err}`
    }

    // return 'test get'
})