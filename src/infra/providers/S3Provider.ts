import * as dotenv from 'dotenv'
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { AbstractStorageProvider } from "../../domain/providers/AbstractStorageProvider";

dotenv.config()

export class S3Provider implements AbstractStorageProvider {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION! });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  async getObject(key: string): Promise<Uint8Array | undefined> {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );

    const buffer = await response.Body?.transformToByteArray()
    return buffer;
  }
}