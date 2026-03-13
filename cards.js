const ICONS = {
    play: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.73.5.5 5.74.5 12c0 5.08 3.29 9.38 7.86 10.9"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3.9 12a4.1 4.1 0 0 1 4.1-4.1h3v2"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>'
};

function getIconHTML(meta){
    if(meta.icon){
        let src = meta.icon;
        if(typeof src === 'string' && src.startsWith('/')) src = src.slice(1);
        if(src.startsWith('http')){
            return `<img src="${src}" alt="${meta.text||''}" style="width:18px;height:18px;">`;
        }
        // local-relative
        return `<img src="${src}" alt="${meta.text||''}" style="width:18px;height:18px;">`;
    }
    return ICONS[meta.icon] || ICONS.link;
}




(async function(){
    const data = await fetch('cards.json').then(r=>r.json());
    const tagsDict = data.tags || {};
    const buttonsDict = data.buttons || {};
    const cardsDict = data.cards || {};

    document.querySelectorAll('card[game]').forEach(el=>{
        const id = el.getAttribute('game');
        const cardData = cardsDict[id];
        const holder = document.createElement('div');
        holder.style.display = 'inline-block';
        holder.style.margin = '0';

        if(!cardData){
            holder.innerHTML = `<div style="width:300px;height:200px;background:#111;color:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center">Card "${id}" not found</div>`;
        } else {
            const card = document.createElement('div');
            card.className = 'card-root';
            const g0 = cardData.visual?.gradient?.[0] || '#1e3c72';
            const g1 = cardData.visual?.gradient?.[1] || '#2a5298';
            card.style.background = `linear-gradient(135deg, ${g0} 0%, ${g1} 100%)`;

            const img = document.createElement('img');
            img.className = 'card-image';
            let imgSrc = cardData.image?.url || '';
            if(typeof imgSrc === 'string' && imgSrc.startsWith('/')) imgSrc = imgSrc.slice(1);
            img.src = imgSrc;
            img.alt = cardData.image?.alt || '';
            card.appendChild(img);

            const content = document.createElement('div');
            content.className = 'card-content';

            const topDiv = document.createElement('div');
            topDiv.style.flex = '2';
            topDiv.style.display = 'flex';
            topDiv.style.flexDirection = 'column';
            topDiv.style.justifyContent = 'center';
            topDiv.style.alignItems = 'center';
            topDiv.style.width = '100%';
            topDiv.style.textAlign = 'center';

            const title = document.createElement('div');
            title.className = 'card-title';
if (data.title && data.title.trim() !== '') {
    title.textContent = data.title;
} else {
    title.style.display = 'none';
}



            title.style.color = cardData.visual?.titleColor || '#fff';

            const desc = document.createElement('div');
            desc.className = 'card-description';
if (data.description && data.description.trim() !== '') {
    desc.textContent = data.description;
} else {
    desc.style.display = 'none'; 
}

            const tagsWrap = document.createElement('div');
            tagsWrap.className = 'card-tags';
            (cardData.tags||[]).forEach(tagId=>{
                const tmeta = tagsDict[tagId] || { label: tagId, bg: 'rgba(0,0,0,0.45)', color:'#fff' };
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tmeta.label;
                span.style.background = tmeta.bg;
                span.style.color = tmeta.color;
                tagsWrap.appendChild(span);
            });

            topDiv.append(title, desc, tagsWrap);

            const bottomDiv = document.createElement('div');
            bottomDiv.style.flex = '1';
            bottomDiv.style.width = '100%';
            bottomDiv.style.display = 'flex';

            const actionsWrap = document.createElement('div');
            actionsWrap.className = 'card-actions';
            actionsWrap.style.width = '100%';
            actionsWrap.style.display = 'flex';

            const allActions = cardData.actions || [];
            const MAX_VISIBLE = 4;
            const visible = allActions.slice(0, MAX_VISIBLE);
            const hidden = allActions.slice(MAX_VISIBLE);

            if(hidden.length && visible.length === MAX_VISIBLE){
                visible[MAX_VISIBLE-1] = { 
                    id: 'more', 
                    text: `+${hidden.length}`, 
                    icon: 'link', 
                    color: '#444', 
                    _hidden: hidden 
                };
            }

            visible.forEach(act=>{
    const meta = { ...(buttonsDict[act.id]||{}), ...act };
    const btn = document.createElement('a');
    btn.className = 'action-button';
    let href = meta.url || '#';
    if(typeof href === 'string' && href.startsWith('/')) href = href.slice(1);
    btn.href = href;
    btn.target = '_blank';
    btn.style.background = meta.color || '#0e79b2';
    btn.style.flex = '1 1 0';
    btn.style.height = '100%';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.gap = '.4rem';
    btn.style.color = '#fff';
    btn.style.fontWeight = '600';
    btn.style.textDecoration = 'none';

    const icon = document.createElement('span');
    icon.className = 'action-icon';
    icon.innerHTML = getIconHTML(meta);

    const text = document.createElement('span');
    text.className = 'action-text';
    text.textContent = meta.text || '';
    if(visible.length>2) text.style.display = 'none';

    btn.append(icon, text);
    actionsWrap.appendChild(btn);
});

            bottomDiv.appendChild(actionsWrap);
            content.append(topDiv, bottomDiv);
            card.appendChild(content);
            holder.appendChild(card);
        }

        el.replaceWith(holder);
    });

    function showMoreMenu(hidden, btn){
        let menu = btn.parentElement.querySelector('.more-menu');
        if(!menu){
            menu = document.createElement('div');
            menu.className = 'more-menu';
            menu.style.position = 'absolute';
            menu.style.background = '#222';
            menu.style.color = '#fff';
            menu.style.padding = '6px';
            menu.style.borderRadius = '8px';
            menu.style.boxShadow = '0 6px 12px rgba(0,0,0,0.35)';
            menu.style.display = 'none';
            menu.style.zIndex = '40';
            btn.parentElement.appendChild(menu);
        }
        menu.innerHTML = '';
            hidden.forEach(h=>{
            const meta = h;
            const link = document.createElement('a');
            let lhref = meta.url || '#';
            if(typeof lhref === 'string' && lhref.startsWith('/')) lhref = lhref.slice(1);
            link.href = lhref;
            link.innerHTML = (ICONS[meta.icon]||'') + `<span style="margin-left:.5rem">${meta.text||meta.url}</span>`;
            link.style.color = '#fff';
            link.target = '_blank';
            link.rel = 'noopener';
            menu.appendChild(link);
        });
        menu.style.display = menu.style.display==='block'?'none':'block';
        const rect = btn.getBoundingClientRect();
        menu.style.top = rect.top - menu.offsetHeight + 'px';
        menu.style.left = rect.left + 'px';
    }
})();
