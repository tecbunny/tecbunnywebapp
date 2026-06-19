import sharp from 'sharp';
import { logger } from './logger';

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
}

/**
 * Optimizes an image buffer using Sharp, converting it to WebP format
 * and constraining dimensions for web optimization.
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: { maxWidth?: number; maxHeight?: number } = { maxWidth: 1920, maxHeight: 1920 }
): Promise<ProcessedImage> {
  try {
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    const processedImage = await image
      .resize({
        width: options.maxWidth,
        height: options.maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: processedImage.data,
      width: processedImage.info.width,
      height: processedImage.info.height,
      format: 'webp',
    };
  } catch (error) {
    logger.error('Failed to process image with sharp', { error });
    throw new Error('Image processing failed');
  }
}

/**
 * Returns a Sharp transform stream that can be piped into from a Readable stream
 * and piped out to a Writable stream (e.g., Supabase upload).
 */
export function createOptimizeImageStream(
  options: { maxWidth?: number; maxHeight?: number } = { maxWidth: 1920, maxHeight: 1920 }
): sharp.Sharp {
  return sharp()
    .resize({
      width: options.maxWidth,
      height: options.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 });
}
