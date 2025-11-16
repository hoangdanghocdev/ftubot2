
export const fileToGenerativePart = async (file: File): Promise<{ mimeType: string; data: string }> => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result is "data:mime/type;base64,..."
        // We need to remove the "data:mime/type;base64," part.
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as data URL."));
      }
    };
    reader.onerror = (error) => {
        reject(error);
    };
    reader.readAsDataURL(file);
  });

  return {
    mimeType: file.type,
    data: await base64EncodedDataPromise,
  };
};
