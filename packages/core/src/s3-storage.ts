// AWS S3 Storage Service
// @ts-ignore
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
// @ts-ignore
import { getSignedUrl as getPresignedUrl } from '@aws-sdk/s3-request-presigner';

import crypto from 'crypto';
import { logger } from '@tecbunny/core';

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const isS3Configured = Boolean(
  AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && S3_BUCKET_NAME
);

let s3Client: any | null = null;

// Configure AWS
if (isS3Configured) {
  s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!
    }
  });
}

function ensureS3Configured(operation: string) {
  if (!isS3Configured || !s3Client) {
    logger.warn('s3_storage_not_configured', { operation });
    throw new Error('S3 storage is not configured');
  }
}

export interface S3UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

// Add magic bytes validation
function verifyMagicBytes(buffer: Buffer, extension: string): boolean {
  if (buffer.length < 4) return false;
  const hex = buffer.toString('hex', 0, 4).toUpperCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return hex.startsWith('FFD8FF');
    case 'png':
      return hex === '89504E47';
    case 'pdf':
      return hex === '25504446'; // %PDF
    case 'webp':
      if (buffer.length < 12) return false;
      const riff = buffer.toString('hex', 0, 4).toUpperCase();
      const webp = buffer.toString('hex', 8, 12).toUpperCase();
      return riff === '52494646' && webp === '57454250';
    default:
      return true; // Allow other extensions if allowedExtensions explicitly permits them
  }
}

/**
 * Upload file to S3
 */
export async function uploadToS3(
  file: File | Buffer | string,
  folder: string = 'uploads',
  options?: {
    publicAccess?: boolean;
    fileName?: string;
    allowedExtensions?: string[];
    maxSizeBytes?: number;
  }
): Promise<S3UploadResult> {
  try {
    ensureS3Configured('upload');

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(16).toString('hex');
    let fileName = options?.fileName || `${timestamp}-${randomId}`;
    let extension = '';

    if (file instanceof File) {
      if (fileName.includes('.')) {
        extension = fileName.split('.').pop()?.toLowerCase() || '';
      } else {
        extension = file.name.split('.').pop()?.toLowerCase() || '';
        if (extension) {
          fileName += `.${extension}`;
        }
      }
    } else if (fileName.includes('.')) {
      extension = fileName.split('.').pop()?.toLowerCase() || '';
    }

    const allowedExtensions = options?.allowedExtensions || ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
    if (extension && !allowedExtensions.includes(extension)) {
      throw new Error(`File extension not allowed: .${extension}. Allowed: ${allowedExtensions.join(', ')}`);
    }

    const key = `${folder}/${fileName}`;

    let fileBuffer: Buffer;
    let contentType = 'application/octet-stream';

    // Handle different input types
    if (file instanceof File) {
      fileBuffer = Buffer.from(await file.arrayBuffer());
      contentType = file.type;
    } else if (Buffer.isBuffer(file)) {
      fileBuffer = file;
    } else if (typeof file === 'string') {
      fileBuffer = Buffer.from(file, 'base64');
    } else {
      throw new Error('Invalid file format');
    }

    const maxSizeBytes = options?.maxSizeBytes || 10 * 1024 * 1024; // 10MB default
    if (fileBuffer.length > maxSizeBytes) {
      throw new Error(`File size exceeds the limit of ${maxSizeBytes / 1024 / 1024}MB`);
    }

    if (extension && !verifyMagicBytes(fileBuffer, extension)) {
      throw new Error(`Invalid file signature (Magic byte mismatch) for extension .${extension}`);
    }

    // Upload to S3
    const uploadParams = {
      Bucket: S3_BUCKET_NAME!,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: options?.publicAccess !== false ? 'public-read' as any : undefined,
      CacheControl: 'max-age=31536000' // 1 year
    };

    await s3Client!.send(new PutObjectCommand(uploadParams));

    // Generate public URL
    const url = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    const result: S3UploadResult = {
      url,
      public_id: key,
      secure_url: url,
      bytes: fileBuffer.length
    };

    return result;

  } catch (error) {
    logger.error('S3 upload error:', { error });
    throw error;
  }
}

/**
 * Upload hero banner image to S3
 */
export async function uploadHeroBanner(file: File | Buffer, folder: string = 'hero-banners'): Promise<S3UploadResult> {
  return uploadToS3(file, folder, { publicAccess: true });
}

/**
 * Upload product image to S3
 */
export async function uploadProductImage(file: File | Buffer): Promise<S3UploadResult> {
  return uploadToS3(file, 'products', { publicAccess: true });
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(key: string): Promise<boolean> {
  try {
    ensureS3Configured('delete');

    const deleteParams = {
      Bucket: S3_BUCKET_NAME!,
      Key: key
    };

    await s3Client!.send(new DeleteObjectCommand(deleteParams));
    return true;
  } catch (error) {
    logger.error('S3 delete error:', { error });
    return false;
  }
}

/**
 * Get signed URL for private S3 files
 */
export async function getS3SignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    ensureS3Configured('signed_url');

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME!,
      Key: key
    });

    return await getPresignedUrl(s3Client!, command, { expiresIn });
  } catch (error) {
    logger.error('S3 signed URL error:', { error });
    throw error;
  }
}