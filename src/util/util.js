import fs from "fs";
import Jimp from "jimp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}
const s3Config = {
  credentials: {
      accessKeyId: "AKIA55LG67TMINAMNEOV",
      secretAccessKey: "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",
  },
  bucket: "user3104036project2bucket",
  region: "us-east-1"
}

export async function filterImageFromURLS3(inputURL) {
  const s3 = new S3Client(s3Config);

  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, async (img) => {
          // Upload filtered image to S3
          const fileContent = await Jimp.read(outpath).getBufferAsync();
          const uploadParams = {
            Bucket: s3Config.bucket,
            Key: "filtered_" + Date.now() + ".jpg",
            Body: fileContent,
            ContentType: "image/jpeg"
          };
          await s3.send(new PutObjectCommand(uploadParams));

          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}