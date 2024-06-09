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
const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const allowed_file_size = 1;//mb

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // return { body }

    //str;

    console.log("body name", body.name, body.name.replace(/\s/g, '-'))
    console.log("check photo", body.photos)

    // return 'test'

    if (body?.photos && Array.isArray(body.photos) && body.name && body.task) {
        const name = body.name.replace(/\s/g, '-')
        const task = body.task.toLowerCase().replace(/\s/g, '-')

        try {
            const responses = await Promise.allSettled(body.photos.map((photo: Photo) => {

                //Validate files
                const file_extension = photo.name.slice(
                    ((photo.name.lastIndexOf('.') - 1) >>> 0) + 2
                );
            
                if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(photo.type)) {
                    throw Error('Invalid file');
                }

                if ((photo.size / (1024 * 1024)) > allowed_file_size) {                  
                    throw Error('File too large');
                 }

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