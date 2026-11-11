// Cloudflare Pages Function — proxies the app's API calls to the Google Apps Script backend.
// The frontend POSTs {fn, arg} to /api; this forwards it to Apps Script and returns the JSON.
// APPS_SCRIPT_URL is set as an environment variable in the Cloudflare Pages project (not in the repo).

export async function onRequestPost(context) {
  const { request, env } = context;
  const url = env.APPS_SCRIPT_URL;
  if (!url) {
    return json({ e: "Server not configured (APPS_SCRIPT_URL missing)." });
  }
  let body = "";
  try { body = await request.text(); } catch (_) {}
  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      redirect: "follow",
    });
    const text = await upstream.text();
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return json({ e: "Could not reach the backend. Please try again." });
  }
}

// Friendly message for GET /api (so hitting it in a browser isn't confusing).
export async function onRequestGet() {
  return json({ ok: true, info: "TripSplit API proxy is running." });
}

function json(obj) {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
