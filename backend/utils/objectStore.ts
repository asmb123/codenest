import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    CreateBucketCommand,
    DeleteBucketCommand,
    CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


if (!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
    throw new Error("Missing critical AWS credentials in environment variables.");
}

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.API_URL,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

export async function createUserBucket(username: string) {
    const command = new CreateBucketCommand({
        Bucket: `${username}-buck`,
        CreateBucketConfiguration: {
            Bucket: {
                DataRedundancy: "SingleLocalZone",
                Type: "Directory",
            },
            Tags: [
                {
                    Key: `${username}-key`,
                    Value: `${username}-value`,
                },
            ],
        }
    })
    const res = await s3.send(command)
    return res.$metadata;
}

export async function deleteBucket(bucketname: string) {
    const command = new DeleteBucketCommand({
        Bucket: bucketname
    });
    const res = await s3.send(command);
    return res.$metadata;
}

export async function copyObject(destinationbucket: string, source: string, key: string) {
    const input = {
        Bucket: destinationbucket,
        CopySource: source,
        Key: key
    };
    const command = new CopyObjectCommand(input);
    const response = await s3.send(command);
}

export async function getReadFileUrl(bucketname: string, key: string) {
    const getUrl = await getSignedUrl(
        s3 as any,
        new GetObjectCommand({ Bucket: bucketname, Key: key }),
        { expiresIn: 1000 },
    );
    return getUrl;
}

export async function getPutFileUrl(bucketname: string, key: string) {
    const putUrl = await getSignedUrl(
        s3 as any,
        new PutObjectCommand({
            Bucket: bucketname,
            Key: key,
        }),
        { expiresIn: 3600 },
    );
    return putUrl;
}

export async function listFiles(lang: string) {
    const objList = await s3.send(new ListObjectsV2Command({ Bucket: `codenest` }))

    let files: string[] = [];
    objList.Contents?.forEach((currVal) => {
        if (currVal.Key) {
            files.push(currVal.Key)
        }
        const substr = `${lang}/`
        files = files.filter(word => word.includes(substr));
    })
    return files;
}