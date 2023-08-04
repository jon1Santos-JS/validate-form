import { NextApiRequest, NextApiResponse } from 'next';
import { changeUserImg } from '@/lib/controllers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const response = await changeUserImg(req.body as UserWithImgType);
            res.status(200).json(response);
            break;
        }
        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}

export const config = {
    api: {
        bodyParser: '1mb',
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
