import router from "../../router";
import mongo from "../../../utils/mongo";
import restError from "../../../utils/restError";

router.on("/v2/projects", async function(request, response) {
    response.contentType = "application/json";
    try {
        const client = mongo.client;
        await client.connect();
        const record = client
            .db("metadata")
            .collection("projects")
            .find({});
        const result: any[] = [];
        for await (const doc of record) {
            result.push({
                id: doc.id,
                name: doc.name
            });
        }
        response.response = {
            code: 200,
            data: result
        };
        await client.close();
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
