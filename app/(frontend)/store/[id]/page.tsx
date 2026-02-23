import Main from "./components/Main";


export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
 

  return (
   <Main id={id} />
  );
}
