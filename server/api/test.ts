import {
    S3Client,
    PutObjectCommand,
    // CreateBucketCommand,
    // DeleteObjectCommand,
    // DeleteBucketCommand,
    // paginateListObjectsV2,
    // GetObjectCommand,
    ListBucketsCommand
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

export default defineEventHandler(async (event) => {
    console.log("running test3")

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

    const command = new PutObjectCommand({
        Bucket: "dopat-scavenger-hunt",
        Key: "table-1/hello-s3.txt",
        Body: "Hello S3!",
    });

    try {
        const response = await s3Client.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
    }

    return 'test aws api complete'
})
