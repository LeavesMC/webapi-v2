import router from "../../../router.ts";
import { db } from "../../../utils/db/db.ts";

router.on("/v2/projects", async function(_, response) {
    const result = await db().query("select * from projects");
    response.response = result.rows;
});
