import { MongoClient, ServerApiVersion } from "mongodb";
import Env from "./environmentVariables";

class MongoDB {
    public readonly client:MongoClient = new MongoClient(Env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
}

const mongodb: MongoDB = new MongoDB();

export default mongodb;