// Cloudflare Pages middleware for host-aware canonical redirects.
// _redirects is path-based, so domain redirects live here.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname;

  if (host === 'edunavata-blog.pages.dev' || host === 'www.edunavata.com') {
    url.hostname = 'edunavata.com';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
