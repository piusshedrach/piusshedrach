import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';

export default function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
  const sheet = new ServerStyleSheet();

  try {
    const markup = renderToString(
      sheet.collectStyles(<ServerRouter context={routerContext} url={request.url} />),
    );
    const styles = sheet.getStyleTags();
    const html = `<!DOCTYPE html>${markup.replace('</head>', `${styles}</head>`)}`;

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(html, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } finally {
    sheet.seal();
  }
}
