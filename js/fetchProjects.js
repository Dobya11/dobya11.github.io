export const PROJECTSDIR="/projects"
export async function getProjects()
{
    let projectsFile = await fetch(`${PROJECTSDIR}/projects.json`);
    let projectsJson = await projectsFile.json();
    let projects = projectsJson.projects;
    return projects;
}
