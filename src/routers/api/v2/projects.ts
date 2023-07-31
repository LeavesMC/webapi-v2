import router from "../../router";
import mongodb from "../../../utils/mango";

router.on("/v2/projects", async function(request, response) {
    const client = mongodb.client;
    await client.connect();
    const record = client
        .db("metadata")
        .collection("projects")
        .find({});
    const result:any[]=[];
    for await (const doc of record) {
        result.push({
            id: doc.id,
            name: doc.name
        });
    }
    response.response = JSON.stringify(result);
    response.contentType = "application/json";
    await client.close();
})
