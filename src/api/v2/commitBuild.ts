import jwt = require("jsonwebtoken");
import router from "../../router";
import mongodb from "../../mangodb";
import Env from "../../environmentVariables";

router.on("/v2/commitBuild", async function(request, response) {
    const client = mongodb.client;
    await client.connect();
    if (request.method !== "POST") {
        response.status=400;
        await client.close();
        return;
    }
    const token:string = request.headers.authorization;
    console.log(request.headers.authorization);
    console.log(request.headers["authorization"]);
    if(!await verifyToken(token)){
        response.status=401;
        await client.close();
        return;
    }
    response.status=200;
    response.response="AAA";
    await client.close();
});

async function verifyToken(token: string) {
    try {
        jwt.verify(token, Env.API_PUBLIC_KEY, { algorithms: ["RS256"] });
        return true;
    } catch (err) {
        return false;
    }
}
//{
//     "project_id": "$project_id",
//     "project_name": "$project_name",
//     "version": "$mcversion",
//     "time": "$ctime",
//     "channel": "$channel",
//     "promoted": $promoted,
//     "changes": "$changes",
//     "download": {
//         "name": "$jar_name",
//         "sha256": "$jar_sha256",
//         "tag": "$tag"
//     }
// }