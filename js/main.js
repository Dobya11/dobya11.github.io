class Card extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute("name");
        const desc = this.getAttribute("desc");
        const links = JSON.parse(this.getAttribute("links") || "[]");

        this.innerHTML = `
            <div class="card">
                <h4>${name}</h2>
                <p>${desc}</p>
                ${links.map(l => `<a href="${l.url}">${l.label}</a>`).join("")}
            </div>
        `;
    }
}

customElements.define("p-card", Card);