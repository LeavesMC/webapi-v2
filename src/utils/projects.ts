type Project = {
    name: string,
    repo: string
}

const PROJECTS: Map<string, Project> = new Map();

PROJECTS.set("leaves", {
    name: "Leaves",
    repo: "LeavesMC/Leaves"
});

PROJECTS.set("lumina", {
    name: "Lumina",
    repo: "LeavesMC/Lumina"
});

export default PROJECTS;