import { notifications } from "@mantine/notifications";
import { NextResponse } from "next/server";

export async function under360(route: string, body?: any) {
  const newRoute = "/under360" + route;
  return await api(newRoute, body, route.includes("inspect"));
}
export async function api(route: string, body?: any, forceCache?: boolean) {
  const res = await fetch("/api" + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: forceCache ? "force-cache" : "default",
    body: JSON.stringify(body),
  });
  //extract json in order to send notification if necessary
  const resJson = await res.json();
  if (res.status != 200 && res.status != 504) {
    notifications.show({
      title: "Error",
      message: "err" in resJson ? resJson["err"] : JSON.stringify(resJson),
      color: "red",
    });
  }
  //return
  return NextResponse.json(resJson, { status: res.status });
}
