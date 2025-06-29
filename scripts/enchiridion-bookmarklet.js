/* eslint-disable */
javascript: (function () {
  const url = window.location.href;
  const title = document.title;
  const selection = window.getSelection().toString();
  const description = document.querySelector('meta[name="description"]')?.content;

  const baseUrl = 'https://enchiridion.chsmc.tools/add';
  const params = new URLSearchParams({
    url: url,
    title: title,
  });

  if (selection) {
    params.set('content', selection);
  }

  if (description) {
    params.set('summary', description);
  }

  window.open(`${baseUrl}?${params}`, '_blank');
})();
