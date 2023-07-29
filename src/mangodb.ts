import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI:string = process.env["MONGODB_URI"];

class MongoDB {
    public readonly client:MongoClient = new MongoClient(MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
}

const mongodb: MongoDB = new MongoDB();

export default mongodb;