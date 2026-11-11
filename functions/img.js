// Cached image endpoint: GET /img?id=FILEID
// Fetches the image from the Apps Script backend once, then the browser caches it
// for ~10 days (images are immutable, so this is safe and makes reopen instant).

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id || !env.APPS_SCRIPT_URL) {
    return new Response("", { status: 404 });
  }
  try {
    const r = await fetch(env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fn: "api_image", arg: id }),
      redirect: "follow",
    });
    const data = await r.json();
    const dataUrl = data && data.r;
    if (!dataUrl || typeof dataUrl !== "string" || dataUrl.indexOf("base64,") < 0) {
      return new Response("", { status: 404 });
    }
    const comma = dataUrl.indexOf(",");
    const meta = dataUrl.substring(5, comma); // e.g. image/png;base64
    const contentType = meta.split(";")[0] || "image/jpeg";
    const b64 = dataUrl.substring(comma + 1);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache in the browser for 10 days; image for a given id never changes.
        "Cache-Control": "public, max-age=864000, immutable",
      },
    });
  } catch (err) {
    return new Response("", { status: 404 });
  }
}
