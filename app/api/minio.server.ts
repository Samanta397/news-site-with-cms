import * as Minio from 'minio';
import * as process from 'node:process';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});
export const createBucket = async (bucketName: string = 'default') => {
  try {
    const res = await minioClient.bucketExists(bucketName);

    if (res) {
      console.log('Bucket already exists');
      return;
    }

    await minioClient.makeBucket(bucketName);
    console.log('Bucket created successfully');
  } catch (err) {
    console.log(err, 'Failed to create bucket');
  }
};

export async function uploadImage(
  bucketName: string,
  image: File | null | undefined,
) {
  try {
    await createBucket(bucketName);

    const file = await convertBase64(image);

    if (file) {
      const fileName = uuidv4();
      const type = mime.extension(file.type);
      const destinationObject = `${fileName}.${type}`;

      const res = await minioClient.putObject(
        bucketName,
        destinationObject,
        file.buffer,
        file.size,
        {
          'Content-Type': file.type,
        },
      );
      return destinationObject;
    }
    return null;
  } catch (error) {
    console.log('SAVE IMAGE ERROR', error);
    return null;
  }
}

async function isObjectExists(bucketName: string, objectName: string) {
  try {
    await minioClient.statObject(bucketName, objectName);
    return true;
  } catch (error) {
    console.log('OBJECT NOT EXISTS IN S3 BUCKET');
    return false;
  }
}

export async function getObject(bucketName: string, objectName: string) {
  try {
    if (!bucketName || !objectName) {
      return null;
    }

    const objectExists = await isObjectExists(bucketName, objectName);
    if (!objectExists) {
      return null;
    }

    const promise: Promise<string | undefined> = new Promise(
      (resolve, reject) => {
        let buffers: Buffer[] = [];
        minioClient.getObject(bucketName, objectName).then(async (stream) => {
          stream.on('data', (chunk: Buffer) => {
            buffers.push(chunk);
          });

          stream.on('end', () => {
            const buffer = Buffer.concat(buffers);
            const base64String = buffer.toString('base64');

            const dataURL = `data:image/png;base64,${base64String}`;

            resolve(dataURL);
          });

          stream.on('error', (err) => {
            reject({ message: 'Failed to get object', error: err });
          });
        });
      },
    );

    return promise;
  } catch (error) {
    console.log('GET OBJECT ERROR', error);
  }
}

export const convertBase64 = async (file: File | null | undefined) => {
  if (file instanceof File) {
    // Read the File object as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      size: file.size,
      type: file.type,
      buffer: buffer,
    };
  }

  return null;
};
