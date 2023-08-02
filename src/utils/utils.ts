import { MongoClient } from "mongodb";
import { RequestContext } from "vclight-router";
import Env from "./env";
import jwt = require("jsonwebtoken");

class Utils {
    public static getVersionGroup(version: string) {
        const versionSplit = version.split(".");
        return `${versionSplit[0]}.${versionSplit[1]}`;
    }

    public static async getLatestBuildId(client: MongoClient, projectId: string, version: string) {
        const aggregationResult = await client
            .db(projectId)
            .collection(this.getVersionGroup(version))
            .aggregate([
                {
                    $match: {
                        version: version
                    }
                },
                {
                    $group: {
                        _id: null,
                        lastBuildId: {
                            $max: `$build_id`
                        }
                    }
                }
            ])
            .toArray();
        if (aggregationResult.length > 0) {
            return aggregationResult[0].lastBuildId;
        } else {
            return 0;
        }
    }

    public static async authentication(request: RequestContext) {
        const token: any = request.headers["authentication"];
        return !(!token.startsWith("Bearer ") && !await this.verifyToken(token.substring(7)));

    }

    public static async verifyToken(token: string) {
        try {
            jwt.verify(token, Env.API_PUBLIC_KEY, { algorithms: ["RS256"] });
            return true;
        } catch (err) {
            return false;
        }
    }
}

export default Utils;