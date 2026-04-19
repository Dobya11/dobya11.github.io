import { getProjects } from '../js/projectsAPI.js';

function normalizeProject(data = {}) {
    return {
        name: data.name ?? "",
        desc: data.desc ?? "",
        bg: data.bg ?? "",
        tags: Array.isArray(data.tags)
            ? data.tags
            : (data.tags ? String(data.tags).split(",").map(t => t.trim()) : []),
        links: Array.isArray(data.links)
            ? data.links
            : []
    };
}

async function init() {
    const showcase = document.getElementById("showcase");

    const projects = await getProjects();

    projects.forEach(({ data: extractedData }) => {
        const data = normalizeProject(extractedData);
        const card = document.createElement("p-card");
        card.setAttribute("name", data.name);
        card.setAttribute("desc", data.desc);
        card.setAttribute("bg", data.bg);
        card.setAttribute("links", JSON.stringify(data.links));
        card.setAttribute("tags", JSON.stringify(data.tags));

        showcase.appendChild(card);
    });
}

init();