import { connection } from "next/server";
import { Suspense } from "react";

export default async function PPR() {
  return (
    <>
      <p>Hello from the PPR page</p>
      <Suspense fallback="Loading...">
        <DynamicComponent />
      </Suspense>
    </>
  );
}

const DynamicComponent = async () => {
  await connection();

  return "Hello from the dynamic component";
};
