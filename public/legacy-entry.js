// Compatibility loader for visitors who still have the old HTML entrypoint cached.
// The current production page uses a content-hashed JavaScript bundle instead.
const recoveryVersion = '20260909-1';

async function loadCurrentProductionApp() {
  const response = await fetch(`/index.html?orbit-refresh=${recoveryVersion}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch the current site entrypoint (${response.status})`);
  }

  const html = await response.text();
  const documentCopy = new DOMParser().parseFromString(html, 'text/html');

  documentCopy.querySelectorAll('link[rel="stylesheet"][href]').forEach((stylesheet) => {
    const href = stylesheet.getAttribute('href');

    if (href && !document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  });

  const entrypoint = documentCopy
    .querySelector('script[type="module"][src]')
    ?.getAttribute('src');

  if (!entrypoint || entrypoint === '/src/main.jsx') {
    throw new Error('The current production entrypoint could not be resolved');
  }

  await import(entrypoint);
}

loadCurrentProductionApp().catch((error) => {
  console.error('Orbit site recovery failed:', error);

  const refreshedUrl = new URL(window.location.href);

  if (refreshedUrl.searchParams.get('orbit-refresh') !== recoveryVersion) {
    refreshedUrl.searchParams.set('orbit-refresh', recoveryVersion);
    window.location.replace(refreshedUrl.toString());
  }
});
