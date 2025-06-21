import router from "../../../router";
import { db } from "../../../utils/db/db";

router.on("/v2/projects", async function(_, response) {
    const result = await db().query("select * from projects");
    response.response = result.rows;
});
