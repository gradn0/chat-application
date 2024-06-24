import S3 from 'aws-sdk/clients/s3';
import "dotenv/config";

const BUCKET_NAME = process.env.BUCKET_NAME || "empty"
const BUCKET_REGION = process.env.BUCKET_REGION || "eu-west-2"
const ACCESS_KEY = process.env.ACCESS_KEY || "empty"
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "empty"

export const s3 = new S3({
  signatureVersion: 'v4',
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION
});