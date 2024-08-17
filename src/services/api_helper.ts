import { notifications } from "@mantine/notifications";
import { NextResponse } from "next/server";

export async function under360(
  route: string,
  body?: any,
  disableNotification?: boolean
) {
  const newRoute = "/under360" + route;
  try {
    return await api(newRoute, body, route.includes("inspect"));
  } catch (e) {
    if (!disableNotification) {
      notifications.show({
        title: "Error",
        message: "an unknown error occured",
        color: "red",
      });
    }
    return NextResponse.json(
      { err: "an unknown error occured" },
      { status: 500 }
    );
  }
}
export async function api(
  route: string,
  body?: any,
  forceCache?: boolean,
  disableNotification?: boolean
) {
  const res = await fetch("/api" + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: forceCache ? "force-cache" : "default",
    body: JSON.stringify(body),
  });
  //extract json in order to send notification if necessary
  const resJson = await res.json();
  if (res.status != 200 && res.status != 504 && !disableNotification) {
    notifications.show({
      title: "Error",
      message: "err" in resJson ? resJson["err"] : JSON.stringify(resJson),
      color: "red",
    });
  }
  //return
  return NextResponse.json(resJson, { status: res.status });
}
