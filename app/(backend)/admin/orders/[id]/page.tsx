import React from "react";
import Main from "./Main";

export default async function AdminOrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const orderId = (await params).id || "";
  return <Main orderId={orderId} />;
}
