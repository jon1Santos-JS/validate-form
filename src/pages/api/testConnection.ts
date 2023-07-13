import { imageHandler } from '@/lib/imageHandle';
import multer from 'multer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from 'express';

type NextApiRequestWithFormData = NextApiRequest &
    Request & {
        files: unknown[];
    };

type NextApiResponseCustom = NextApiResponse & Response;

export default async function handler(
    req: NextApiRequestWithFormData,
    res: NextApiResponseCustom,
) {
    switch (req.method) {
        case 'POST': {
            const upload = multer(imageHandler.getConfig).single('image');
            upload(req, res, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: 'Upload failed' });
                }
            });
            res.status(200).json({ message: 'Upload successful' });
            break;
        }
        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

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
