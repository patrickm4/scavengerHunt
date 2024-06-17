import {
    S3Client,
    // PutObjectCommand,
    // CreateBucketCommand,
    // DeleteObjectCommand,
    // DeleteBucketCommand,
    // paginateListObjectsV2,
    // GetObjectCommand,
    // ListBucketsCommand
    ListObjectsV2Command
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: 'us-west-2' });
import userGetJson from "@/server/api/aws/user/s3.get"

export default defineEventHandler(async (event) => {
    console.log("running test3")

    try {
        const command = new ListObjectsV2Command({
            Bucket: "dopat-scavenger-hunt",
            delimiter: '/',
        });

        const response = await s3Client.send(command)

        // console.log("checkkk", response.Contents, typeof response.Contents)

        return await Promise.allSettled(response?.Contents?.reduce((acc, obj) => {
            if (obj.Key.endsWith('.json')) {
                acc.push(userGetJson({ fullKey: obj.Key }))
                return acc
            } else {
                return acc
            }
        }, []))

        // return response.Contents.reduce((acc, obj) => {
        //     // console.log("checkkk", obj, obj.key)
        //     if (obj.Key.endsWith('.json')) {
        //         acc.push(obj.Key)
        //         return acc
        //     }   
        //     // return obj.Key.endsWith('.json')
        // }, [])

        // console.log("checkkk", responses)

        // return response
    } catch (err) {
        console.error(err);
        return {
            error: err
        }
    }

    // const command = new ListBucketsCommand({});

    // try {
    //     const { Owner, Buckets } = await s3Client.send(command);

    //     console.log(
    //         `${Owner.DisplayName} owns ${Buckets.length} bucket${Buckets.length === 1 ? "" : "s"
    //         }:`,
    //     );

    //     console.log(`${Buckets.map((b) => ` • ${b.Name}`).join("\n")}`);
    // } catch (err) {
    //     console.error(err);
    // }

    // const command = new PutObjectCommand({
    //     Bucket: "dopat-scavenger-hunt",
    //     Key: "table-1/hello-s3.txt",
    //     Body: "Hello S3!",
    // });

    // try {
    //     const response = await s3Client.send(command);
    //     console.log(response);
    // } catch (err) {
    //     console.error(err);
    // }

    return 'test aws api complete'
})
