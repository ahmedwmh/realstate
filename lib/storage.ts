import { supabaseAdmin, BUCKET_NAME } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param file - File to upload
 * @param path - Path in the bucket (e.g., 'hero/main-image.jpg')
 * @returns URL of the uploaded image
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!supabaseAdmin || !BUCKET_NAME) {
    throw new Error('Supabase client or bucket name not configured for upload.');
  }

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param path - Path of the image in the bucket (can be full URL or relative path)
 */
export async function deleteImage(path: string): Promise<void> {
  if (!supabaseAdmin || !BUCKET_NAME) {
    console.error('Supabase client or bucket name not configured for delete. Skipping image deletion.');
    return;
  }

  let imagePath = path;
  
  // Extract path from full URL if needed
  if (path.includes('/storage/v1/object/public/')) {
    // Full Supabase Storage URL
    const parts = path.split('/storage/v1/object/public/');
    if (parts.length > 1) {
      imagePath = parts[1].split('/').slice(1).join('/'); // Remove bucket name from path
    }
  } else if (path.includes(BUCKET_NAME + '/')) {
    // URL with bucket name
    imagePath = path.split(BUCKET_NAME + '/')[1];
  } else if (path.startsWith('http')) {
    // Other HTTP URL - try to extract path
    try {
      const url = new URL(path);
      imagePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    } catch {
      // If URL parsing fails, use original path
    }
  }

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([imagePath]);

  if (error) {
    console.error('Error deleting image:', error);
    // Don't throw error - just log it, as the image might already be deleted
  }
}

/**
 * Extract path from Supabase Storage URL
 * @param url - Full URL of the image
 * @returns Path in the bucket
 */
export function extractPathFromUrl(url: string): string {
  if (url.includes(BUCKET_NAME)) {
    return url.split(`${BUCKET_NAME}/`)[1];
  }
  return url;
}

