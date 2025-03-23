import ImageKit from "imagekit";

var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT || "",
});
export const uploadFile = async (dir: string, data: string, name: string, size?: number) => {
    try {
        const response = await imagekit.upload({
            file: data,
            fileName: name,
            folder: dir
        })
        return response.filePath;
    } catch (error: any) {
        console.log("$$$$$ upload error: ", error.message)
        return false;
    }
};
