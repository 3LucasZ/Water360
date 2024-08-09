import { notifications } from "@mantine/notifications";
import { NextResponse } from "next/server";

export async function under360(route: string, params?: Record<string, string>) {
  const newRoute =
    "/under360" + route + "?" + new URLSearchParams(params).toString();
  return await api(newRoute);
}
export async function api(route: string, body?: any) {
  const res = await fetch("/api" + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log(route);
  console.log(body);
  //extract json to send notification
  const resJson = await res.json();
  console.log(resJson);
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
