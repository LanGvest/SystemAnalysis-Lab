self.addEventListener("fetch", e => {
	const {request} = e;
	const url = new URL(request.url);
	if((url.origin === location.origin && !url.pathname.startsWith("/api")) || url.origin === "https://fonts.googleapis.com") return e["respondWith"](getStaticResource(request));
});

async function getStaticResource(request) {
	const c = await caches.open("static"), cd = await c.match(request);
	if(cd) return cd;
	const r = await fetch(request);
	r && r.ok && await c.put(request, r.clone());
	return r;
}