import { getProjects} from '../js/fetchProjects.js'
import { getProject} from '../js/getProjectData.js'

async function getForCards()
{
    const projects = await getProjects();
    projects.forEach(project => {
        console.log(getProject(project));
    });
}
getForCards();
const { data, content } = await getProject("example");

function cardTemplate(data) {
    return `
        <div class="card">
            <h2>${data.name}</h2>
            <p>${data.desc}</p>
        </div>
    `;
}

document.getElementById("showcase").innerHTML += cardTemplate(data);