export async function under360(route: string, params?: Record<string, string>) {
  const path = route + "?" + new URLSearchParams(params).toString();
  const res = await fetch("/api/under360", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
    }),
  });
  console.log("/under360" + route);
  console.log(params);
  return res;
}
export async function api(route: string, body?: any) {
  const res = await fetch("/api" + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log(route);
  console.log(body);
  return res;
}
