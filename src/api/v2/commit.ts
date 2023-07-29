import router from "../../router";
import mongodb from "../../mangodb";

router.on("/v2/commit", async function(request, response) {
    const client = mongodb.client;
    await client.connect();
    if(request.method !== "POST"){
        response.response=JSON.stringify({
            error:"request method must be post"
        });
        response.contentType = "application/json";
        return;
    }
    console.log(request.body.headers);
    console.log(JSON.stringify(request));
    response.response = JSON.stringify({AAA:"AAA"});
    response.contentType = "application/json";
    await client.close();
})

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