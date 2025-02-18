import { MongoClient } from "mongodb";
import { RequestContext } from "@vclight/router";
import Env from "./env";
import jwt = require("jsonwebtoken");
import { EXTRA_VERSION_GROUP } from "../config/versionGroup";

class Utils {
    public static getVersionGroup(projectId: string, version: string) {
        let [major, minor, patch] = version.split(".").map(str => parseInt(str));
        minor = minor || 0;
        patch = patch || 0;
        for (const versionGroup of EXTRA_VERSION_GROUP) {
            if (versionGroup.validate(projectId, [major, minor, patch])) {
                return versionGroup.getGroupName();
            }
        }
        return `${major}.${minor}`;
    }

    public static async getLatestBuildId(client: MongoClient, projectId: string, version: string) {
        const aggregationResult = await client
            .db(projectId)
            .collection(this.getVersionGroup(projectId, version))
            .aggregate([
                {
                    $group: {
                        _id: null,
                        lastBuildId: {
                            $max: "$build_id"
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

    public static async getVersions(client: MongoClient, projectId: string, versionGroup: string) {
        const versionSet: Set<string> = new Set();
        ((await client
            .db(projectId)
            .collection(versionGroup)
            .aggregate([
                {
                    $group: {
                        _id: null,
                        version: { $addToSet: `$version` }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        version: 1
                    }
                }
            ]).toArray())[0].version)
            .forEach((version: string) => {
                versionSet.add(version);
            });
        return versionSet;
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
