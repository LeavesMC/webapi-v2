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
    const token = request.headers.authorization;
    jwt.verify(token, Env.API_PUBLIC_KEY,
        { algorithms: ["RS256"] },
        async (err) => {
            if (err) {
                response.status=401;
                await client.close();
                return;
            } else {
                response.status=200;
                response.response = JSON.stringify({ AAA: "AAA" });
                response.contentType = "application/json";
            }
        });
    await client.close();
});

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