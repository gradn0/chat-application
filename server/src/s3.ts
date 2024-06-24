import S3 from 'aws-sdk/clients/s3';
import "dotenv/config";
import { Request, Response } from "express";
import { getErrorMessage } from './common';
import {v4 as uuidv4} from "uuid"

const BUCKET_NAME = process.env.BUCKET_NAME || ""
const BUCKET_REGION = process.env.BUCKET_REGION || ""
const ACCESS_KEY = process.env.ACCESS_KEY || ""
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || ""

export const s3 = new S3({
  signatureVersion: 'v4',
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION
});

export const getS3Url = async (req: Request, res: Response) => {
  const imageName = uuidv4();

  const params = ({
    Bucket: BUCKET_NAME,
    Key: imageName,
    Expires: 60
  })

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    res.status(200).json({url: uploadURL});
  } catch (error) {
    console.log(error);
    
    res.status(500).json({Error: getErrorMessage(error)})
  }
}