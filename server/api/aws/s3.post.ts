import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import userGetJson from "@/server/api/aws/user/s3.get"

interface Photo {
    fileb64String: string;
    name: string;
    type: string;
    size: number;
}

const s3Client = new S3Client({ region: 'us-west-2' });
const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const allowed_file_size = 100;//mb
const getUserJson = async (name: any) => {
    return await userGetJson({
        name
    })
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body?.photos && Array.isArray(body.photos) && body.name) {
        const name = body.name.replace(/\s/g, '-')
        const task = body.task ? body.task.toLowerCase().replace(/\s/g, '-') : 'general'
        const userJson = JSON.parse(await getUserJson(body.name))
        const completedTasks = userJson?.completedTasks

        try {
            let jsonUpdates: object[] = []

            const updateUserJson = async (photoName: any) => {
                let completeCount = 0
                // let sendObject = { ...userJson }
                let sendObject = structuredClone(userJson)

                if (task !== 'general') {
                    // basically the user just uploaded their first photo
                    if (completedTasks) {
                        const completedLength = Object.entries(sendObject.completedTasks).length
                        // they've completed right when doing the last task
                        completeCount = completedLength + 1
                        if (completeCount >= 12) {
                            // basically if it was the last task, or if they reuploaded a previous task
                            if (completedLength === 11 || completedLength > 11) {
                                // set time stamp
                                sendObject.completedBy = Date.now();
                            }
                        }
                    }

                    if (!sendObject.completedTasks) sendObject.completedTasks = {}
                    sendObject.completedTasks[task] = `${task}/${name}/${photoName}`
                } else {
                    if (!sendObject['general']) sendObject['general'] = []
                    sendObject['general'].push(`general/${name}/${photoName}`)
                }

                const updateUserJsonCommand = new PutObjectCommand({
                    Bucket: "dopat-scavenger-hunt",
                    Key: `${name}/checklist.json`,
                    Body: JSON.stringify(sendObject),
                    ContentType: "application/json"
                })

                jsonUpdates.push(s3Client.send(updateUserJsonCommand))
            }

            const responses = await Promise.allSettled([...body.photos.map((photo: Photo) => {

                //Validate files
                const file_extension = photo.name.slice(
                    ((photo.name.lastIndexOf('.') - 1) >>> 0) + 2
                );

                if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(photo.type)) {
                    throw 'Invalid file';
                }

                if ((photo.size / (1024 * 1024)) > allowed_file_size) {
                    throw 'File too large';
                }
                const buf = Buffer.from(photo.fileb64String.replace(/^data:image\/\w+;base64,/, ""), 'base64')

                const command = new PutObjectCommand({
                    Bucket: "dopat-scavenger-hunt",
                    Key: `${task}/${name}/${photo.name}`,
                    Body: buf,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg'
                });

                updateUserJson(photo.name)

                return s3Client.send(command)
            }), ...jsonUpdates])


            return responses
        } catch (err) {
            return {
                error: `${err}`
            }
        }
    } else {
        return [{
            status: 'fail',
            message: 'No photos submitted, or not array'
        }]
    }
})