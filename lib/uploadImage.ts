// lib/uploadImage.ts
import * as FileSystem from "expo-file-system";
import * as Mime from "react-native-mime-types";

export async function uploadImage(
  uri: string,
  generateUploadUrl: () => Promise<string>
) {
  try {
    const uploadUrl = await generateUploadUrl();
    const mimeType = Mime.lookup(uri) || "image/jpeg";

    const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      mimeType,
    });

    if (uploadResult.status !== 200) {
      throw new Error(`Upload failed with status: ${uploadResult.status}`);
    }

    const { storageId } = JSON.parse(uploadResult.body);

    // For Convex storage, we need to use the getUrl method from the client
    // This is a temporary URL that will work for now
    // In a production app, you should use the proper Convex storage URL format
    const convexUrl =
      process.env.EXPO_PUBLIC_CONVEX_URL || "clever-pig-730.convex.cloud";
    const imageUrl = `https://${convexUrl.replace(/^https?:\/\//, "")}/api/storage/${storageId}`;
    console.log("Generated image URL:", imageUrl);

    return { storageId, url: imageUrl };
  } catch (error) {
    console.error("Error in uploadImage:", error);
    // Rethrow with a more user-friendly message
    throw new Error("Failed to upload image. Please try again.");
  }
}
