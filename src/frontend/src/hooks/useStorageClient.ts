import { ExternalBlob } from "@/backend";

interface StorageClient {
  uploadFile: (
    file: File,
    onProgress?: (pct: number) => void,
  ) => Promise<string>;
  getFileUrl: (fileKey: string) => string;
}

export function useStorageClient(): StorageClient {
  const uploadFile = async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let blob = ExternalBlob.fromBytes(bytes);
    if (onProgress) {
      blob = blob.withUploadProgress(onProgress);
    }
    const url = blob.getDirectURL();
    return url;
  };

  const getFileUrl = (fileKey: string): string => {
    return ExternalBlob.fromURL(fileKey).getDirectURL();
  };

  return { uploadFile, getFileUrl };
}
