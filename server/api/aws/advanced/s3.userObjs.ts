import {
    S3Client,
    ListObjectsV2Command
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: 'us-west-2' });
import userGetJson from "@/server/api/aws/user/s3.get"

export default defineEventHandler(async () => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: "dopat-scavenger-hunt",
        });

        const response = await s3Client.send(command)

        const responses = await Promise.allSettled(response?.Contents?.reduce((acc, obj) => {
            if (obj.Key.endsWith('.json')) {
                acc.push(userGetJson({ fullKey: obj.Key }))
                return acc
            } else {
                return acc
            }
        }, []))

        return responses
    } catch (err) {
        console.error(err);
        return {
            error: err
        }
    }
})
