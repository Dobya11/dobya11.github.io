import jsYaml from 'https://esm.sh/js-yaml';

export const PROJECTSDIR = "/projects";

let cache = null;

export function splitData(str) {
    const normalized = str
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');

    const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
        return { data: {}, content: str.trim() };
    }

    let data = {};
    try {
        data = jsYaml.load(match[1]) || {};
    } catch {
        data = {};
    }

    return {
        data,
        content: match[2].trim()
    };
}

export async function getProject(name) {
    const res = await fetch(`/projects/${name}.html`);
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    const data = {
        name: doc.querySelector("meta[name='title']")?.content ?? "",
        desc: doc.querySelector("meta[name='desc']")?.content ?? "",
        bg: doc.querySelector("meta[name='bg']")?.content ?? "",
        tags: JSON.parse(doc.querySelector("meta[name='tags']")?.content || "[]"),
        links: JSON.parse(doc.querySelector("meta[name='links']")?.content || "[]"),
    };

    const content =
        doc.querySelector(".markdown-body")?.innerHTML ??
        doc.body.innerHTML;

    return { data, content };
}

export async function getProjects() {
    if (cache) return cache;

    const res = await fetch(`${PROJECTSDIR}/projects.json`);
    const json = await res.json();

    cache = await Promise.all(
        json.projects.map(name => getProject(name))
    );

    return cache;
}

export async function getProjectsBy(filters = {}) {
    const projects = await getProjects();

    return projects.filter(p =>
        Object.entries(filters).every(([key, value]) => {
            if (key === "tags") {
                return value.every(tag => p.tags.includes(tag));
            }
            return p[key] === value;
        })
    );
}