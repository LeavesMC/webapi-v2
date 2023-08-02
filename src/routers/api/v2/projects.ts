import router from "../../router";
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
    response.response = result;
});
