import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMaterial(filePath: string, folder = "materials") {
  const res = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
  });

  return {
    url: res.secure_url,
    key: res.public_id,
  };
}

export async function deleteMaterial(key: string) {
  if (!key) return;
  await cloudinary.uploader.destroy(key);
}
