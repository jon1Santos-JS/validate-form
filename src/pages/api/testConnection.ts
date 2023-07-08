import { MongoClient, ServerApiVersion } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri =
    'mongodb+srv://joaosantos58981:HExPSBU0gf4NsKZC@cluster0.jtc0ysv.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const db = client.db('accounts');

        const collection = db.collection('users');
        const docs = await collection.find().toArray();
        return docs;
    } catch (err: unknown) {
        console.log(err);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const getDocs = await run();
    res.status(200).json(getDocs);
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
