function copyInstall() {
  navigator.clipboard.writeText('pip install nx-agent');
  const t = document.getElementById('toast');
  if (!t) return;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function cleanCurrentIndexUrl() {
  if (!location.pathname.endsWith('/index.html')) return;

  const cleanPath = location.pathname.replace(/index\.html$/, '');
  const cleanUrl = location.protocol === 'file:' ? `file://${cleanPath}` : `${location.origin}${cleanPath}`;
  try {
    history.replaceState(null, '', cleanUrl + location.search + location.hash);
  } catch {
    // Some browsers do not allow rewriting file:// paths.
  }
}

cleanCurrentIndexUrl();

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightCode(value) {
  const keywords = new Set(['as', 'class', 'def', 'for', 'from', 'if', 'import', 'in', 'return', 'with']);
  const symbols = new Set(['Agent', 'Workflow', 'Memory', 'TraceLogger', 'str', 'int', 'bool', 'list']);
  const constants = new Set(['False', 'None', 'True']);
  let html = '';
  let index = 0;

  while (index < value.length) {
    const char = value[index];
    const next = value[index + 1];

    if (char === '#') {
      const end = value.indexOf('\n', index);
      const chunk = end === -1 ? value.slice(index) : value.slice(index, end);
      html += `<span class="syntax-comment">${escapeHtml(chunk)}</span>`;
      index += chunk.length;
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      const triple = value.slice(index, index + 3) === quote.repeat(3);
      let end = index + (triple ? 3 : 1);

      while (end < value.length) {
        if (!triple && value[end] === '\\') {
          end += 2;
          continue;
        }

        if (triple && value.slice(end, end + 3) === quote.repeat(3)) {
          end += 3;
          break;
        }

        if (!triple && value[end] === quote) {
          end += 1;
          break;
        }

        end += 1;
      }

      html += `<span class="syntax-string">${escapeHtml(value.slice(index, end))}</span>`;
      index = end;
      continue;
    }

    if (char === '@' && /[A-Za-z_]/.test(next || '')) {
      let end = index + 1;
      while (/[A-Za-z0-9_]/.test(value[end] || '')) end += 1;
      html += `<span class="syntax-function">${escapeHtml(value.slice(index, end))}</span>`;
      index = end;
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let end = index + 1;
      while (/[A-Za-z0-9_]/.test(value[end] || '')) end += 1;
      const word = value.slice(index, end);
      let lookahead = end;
      while (/\s/.test(value[lookahead] || '')) lookahead += 1;
      const className = keywords.has(word)
        ? 'syntax-keyword'
        : symbols.has(word)
          ? 'syntax-symbol'
          : constants.has(word)
            ? 'syntax-constant'
            : value[lookahead] === '('
              ? 'syntax-function'
              : word === 'nx_agent'
                ? 'syntax-module'
                : '';

      html += className ? `<span class="${className}">${word}</span>` : escapeHtml(word);
      index = end;
      continue;
    }

    if (/\d/.test(char)) {
      let end = index + 1;
      while (/[\d.]/.test(value[end] || '')) end += 1;
      html += `<span class="syntax-number">${escapeHtml(value.slice(index, end))}</span>`;
      index = end;
      continue;
    }

    html += escapeHtml(char);
    index += 1;
  }

  return html;
}

document.querySelectorAll('.docs-code code, .quick-step > div > code').forEach((block) => {
  if (block.dataset.highlighted) return;
  block.innerHTML = highlightCode(block.textContent);
  block.dataset.highlighted = 'true';
});

function getHomeUrl() {
  let path = location.pathname.replace(/index\.html$/, '');
  path = path.replace(/\/(docs|get-started)\/$/, '/');
  if (!path.endsWith('/')) path += '/';
  return location.protocol === 'file:' ? `file://${path}` : `${location.origin}${path}`;
}

function getHomeLoadUrl() {
  const homeUrl = getHomeUrl();
  return location.protocol === 'file:' ? `${homeUrl}index.html` : homeUrl;
}

function scrollToSection(id, instant = false) {
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', getHomeUrl());
  return true;
}

document.querySelectorAll('[data-scroll-target]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    const target = link.dataset.scrollTarget;
    event.preventDefault();

    if (scrollToSection(target)) return;

    sessionStorage.setItem('nxagent-scroll-target', target);
    location.href = getHomeLoadUrl();
  });
});

document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    const href = link.getAttribute('href');
    if (location.protocol !== 'file:') return;

    const url = new URL(href, location.href);
    if (url.protocol !== 'file:' || !url.pathname.endsWith('/')) return;

    event.preventDefault();
    url.pathname += 'index.html';
    location.href = url.href;
  });
});

document.querySelectorAll('a[href*="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented) return;

    const url = new URL(link.getAttribute('href'), location.href);
    if (url.pathname !== location.pathname || !url.hash) return;

    const target = document.querySelector(url.hash);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', url.href);
  });
});

const initialScrollTarget = sessionStorage.getItem('nxagent-scroll-target');
if (initialScrollTarget) {
  sessionStorage.removeItem('nxagent-scroll-target');
  requestAnimationFrame(() => scrollToSection(initialScrollTarget, true));
}
