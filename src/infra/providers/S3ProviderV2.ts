import S3 from "aws-sdk/clients/s3";
import * as dotenv from 'dotenv'
import { AbstractStorageProvider } from "../../domain/providers/AbstractStorageProvider";
import { handlePromise } from "../../utils/handlePromise";
import { NotFoundError } from "elysia";

dotenv.config()

export class S3ProviderV2 implements AbstractStorageProvider {
  private s3Client: S3;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3({ region: process.env.AWS_REGION! });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  async getObject(key: string): Promise<Uint8Array | undefined> {

    const command: S3.GetObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
    }

    const [err, response] = await handlePromise<S3.GetObjectOutput>(this.s3Client.getObject(command).promise())
    if (err) throw new NotFoundError(`S3 object does not exist: ${err}`)

    const buffer = response.Body as Uint8Array
    return buffer
  }
}