import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.SKILLHUB_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.SKILLHUB_CLOUDINARY_API_KEY,
  api_secret: process.env.SKILLHUB_CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.SKILLHUB_CLOUDINARY_CLOUD_NAME &&
    process.env.SKILLHUB_CLOUDINARY_API_KEY &&
    process.env.SKILLHUB_CLOUDINARY_API_SECRET
  );
}

/**
 * Generate authenticated signed parameters for direct browser-to-Cloudinary upload
 */
export function generateSignedUploadParams(folder: string = "skillhub-portfolio") {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.SKILLHUB_CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    folder,
    signature,
    apiKey: process.env.SKILLHUB_CLOUDINARY_API_KEY!,
    cloudName: process.env.SKILLHUB_CLOUDINARY_CLOUD_NAME!,
  };
}

export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured() || !publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch {
    return false;
  }
}
