import CheckoutMain from "./CheckoutMain";

export default async function Checkout({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  // const orderId = (await params).query || "";
  // const urlParams = new URLSearchParams(query);
  // const orderNumber = urlParams.get("orderNumber") || "";

    const orderId = (await params).query || "";


  return <CheckoutMain  orderId={orderId} />;
}
