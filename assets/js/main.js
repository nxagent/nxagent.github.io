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
