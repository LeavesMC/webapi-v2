import { MongoClient, ServerApiVersion } from "mongodb";
import Env from "./env";

class MongoDB {
    public readonly client:MongoClient = new MongoClient(Env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
}

const mongo: MongoDB = new MongoDB();

export default mongo;