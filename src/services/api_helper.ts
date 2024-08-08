import { notifications } from "@mantine/notifications";
import { NextResponse } from "next/server";

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
  //extract json to send notification
  const resJson = await res.json()
  console.log(resJson)
  if (res.status != 200) {
    notifications.show({
      title: "Error",
      message: 'err' in resJson ? resJson["err"] : JSON.stringify(resJson),
      color: "red",
    });
  }
  //return
  return NextResponse.json(resJson, { status: res.status });
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
  const resJson = await res.json()
  console.log(resJson)
  if (res.status != 200) {
    notifications.show({
      title: "Error",
      message: 'err' in resJson ? resJson["err"] : JSON.stringify(resJson),
      color: "red",
    });
  }
  //return
  return NextResponse.json(resJson, { status: res.status });
}
