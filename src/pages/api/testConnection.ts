import {
    NextApiRequestWithFormData,
    NextApiResponseCustom,
    imageHandler,
} from '@/database/imageHandler';

export default async function handler(
    req: NextApiRequestWithFormData,
    res: NextApiResponseCustom,
) {
    switch (req.method) {
        case 'POST': {
            imageHandler.refreshDirectory();
            imageHandler.uploadImage(req, res);
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
