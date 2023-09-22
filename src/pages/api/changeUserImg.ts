import { NextApiRequest, NextApiResponse } from 'next';
import { changeUserImg } from '@/lib/controllers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const response = await changeUserImg(req.body as UserWithImgType);
            return res.status(200).json(response);
        }
        default:
            return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export const config = {
    api: {
        bodyParser: '1mb',
    },
};

// import { MongoClient, ServerApiVersion } from 'mongodb';

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(process.env.MONGO_DB_URI as string, {
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

//         const newAccounts = [
//             {
//                 ID: '0',
//                 constraint: 'admin',
//                 username: {
//                     value: 'admins',
//                 },
//                 password: {
//                     value: 'admins',
//                 },
//                 userImage: 'https://i.ibb.co/gjc1KnN/perfil-default-img.png',
//             },
//             {
//                 ID: '1',
//                 constraint: 'user',
//                 username: {
//                     value: 'carlos',
//                 },
//                 password: {
//                     value: 'asdasd',
//                 },
//                 userImage:
//                     'https://i.ibb.co/QHcc4Lv/office-funcionarios-copiar.png',
//             },
//             {
//                 ID: '2',
//                 constraint: 'user',
//                 username: {
//                     value: 'mariana',
//                 },
//                 password: {
//                     value: 'asdasd',
//                 },
//                 userImage: 'https://i.ibb.co/gjc1KnN/perfil-default-img.png',
//             },
//         ];

//         const updateOperation = {
//             $set: {
//                 accounts: newAccounts,
//             },
//         };
//         const result = await collection.updateMany({}, updateOperation);
//         console.log(result);
//     } catch (err: unknown) {
//         console.log(err);
//     } finally {
//         await client.close();
//     }
// }
