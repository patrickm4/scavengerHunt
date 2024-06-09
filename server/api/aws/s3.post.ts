import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

interface Photo {
    fileb64String: string;
    name: string;
    type: string;
    size: number;
}

const s3Client = new S3Client({region: 'us-west-2'});

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // return { body }

    //str;

    // console.log("body name", body.name, body.name.replace(/\s/g, '-'))

    if (body?.photos && Array.isArray(body.photos) && body.name && body.task) {
        const name = body.name.replace(/\s/g, '-')
        const task = body.task.toLowerCase().replace(/\s/g, '-')

        try {
            const responses = await Promise.allSettled(body.photos.map((photo: Photo) => {
                const buf = Buffer.from(photo.fileb64String.replace(/^data:image\/\w+;base64,/, ""), 'base64')

                const command = new PutObjectCommand({
                    Bucket: "dopat-scavenger-hunt",
                    Key: `${task}/${name}/${photo.name}`,
                    Body: buf,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg'
                });

                return s3Client.send(command)
            }))

            return responses
        } catch (err) {
            console.error('s3 photo upload error: ', err);
            return {
                error: err
            }
        }
    } else {
        return [{
            status: 'fail',
            message: 'No photos submitted, or not array'
        }]
    }
})