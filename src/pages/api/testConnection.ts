import { MongoClient, ServerApiVersion } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri =
    'mongodb+srv://admins:admins@atlascluster.rc4ew.mongodb.net/?retryWrites=true&w=majority';

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log(client.db().collection('users').find({}));
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
    await run();
    res.status(200).send('foi');
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
