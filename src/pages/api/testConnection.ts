import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { IncomingForm } from 'formidable';

interface File {
    /**
     * The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'`
     * event), this property says how many bytes of the file have been written to disk yet.
     */
    size: number;

    /**
     * The path this file is being written to. You can modify this in the `'fileBegin'` event in case
     * you are unhappy with the way formidable generates a temporary path for your files.
     */
    filepath: string;

    /**
     * The name this file had according to the uploading client.
     */
    originalFilename: string | null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).json({ message: 'Error uploading file.' });
                return;
            }

            const uploadedFile: File = files.file;
            const tempPath = uploadedFile.filepath;
            const targetPath = path.join(
                process.cwd(),
                'public/uploads',
                uploadedFile.originalFilename,
            );

            fs.rename(tempPath, targetPath, (err) => {
                if (err) {
                    res.status(500).json({
                        message: 'Error moving file to target location.',
                    });
                    return;
                }

                res.status(200).json({
                    message: 'File uploaded successfully!',
                });
            });
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

// import { MongoClient, ServerApiVersion } from 'mongodb';

// const uri =
//     'mongodb+srv://joaosantos58981:HExPSBU0gf4NsKZC@cluster0.jtc0ysv.mongodb.net/?retryWrites=true&w=majority';

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// });

// async function run() {
//     try {
//         await client.connect();
//         const db = client.db('accounts');

//         const collection = db.collection('users');
//         const docs = await collection.find().toArray();
//         return docs;
//     } catch (err: unknown) {
//         console.log(err);
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

export const config = {
    api: {
        bodyParser: false,
    },
};
