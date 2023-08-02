import router from "../../router";
import mongo from "../../../utils/mongo";
import restError from "../../../utils/restError";
import PROJECTS from "../../../utils/projects";

router.on("/v2/projects", async function(request, response) {
    response.contentType = "application/json";
    const result: any[] = [];
    PROJECTS.forEach((value,key)=>{
        result.push({
            id: key,
            name: value.name,
            repo: value.repo
        });
    })
    response.response = {
        code: 200,
        data: result
    };
});
