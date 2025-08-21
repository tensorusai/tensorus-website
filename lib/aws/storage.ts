import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.S3_BUCKET_NAME!;

export async function uploadFile(key: string, file: Buffer, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });
    
    await s3Client.send(command);
    return { 
      url: `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${key}`,
      error: null 
    };
  } catch (error) {
    return { url: null, error };
  }
}

export async function getSignedUploadUrl(key: string, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { signedUrl, error: null };
  } catch (error) {
    return { signedUrl: null, error };
  }
}

export async function getSignedDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { signedUrl, error: null };
  } catch (error) {
    return { signedUrl: null, error };
  }
}

export async function deleteFile(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    
    await s3Client.send(command);
    return { error: null };
  } catch (error) {
    return { error };
  }
}