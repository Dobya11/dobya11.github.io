import {PROJECTSDIR} from '../js/fetchProjects.js'
import jsYaml from 'https://esm.sh/js-yaml'
export async function getProject(name) 
{
    let project = await fetch(`${PROJECTSDIR}/${name}.mdx`);
    let projectData= await project.text();
    return splitData(projectData);
}
async function splitData(str) {
    const normalized = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    let data = jsYaml.load(match[1]);
    let content = match[2].trim();
    return {data,content};
}