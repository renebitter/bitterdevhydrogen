import {RemixServer} from '@remix-run/react';
import {renderToReadableStream} from 'react-dom/server';
import isbot from 'isbot';

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
  );

  if (isbot(request.headers.get('User-Agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(body, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
