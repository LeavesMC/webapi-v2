import router from "../../router";
import mongodb from "../../mangodb";

router.on("/v2/commit", async function(request, response) {
    const client = mongodb.client;
    await client.connect();
    // if(request.method !== "POST"
    // const record = client
    //     .db("metadata")
    //     .collection("projects")
    //     .find({});
    // const result:any[]=[];
    // for await (const doc of record) {
    //     result.push({
    //         id: doc.id,
    //         name: doc.name
    //     });
    // }
    // response.response = JSON.stringify(result);
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