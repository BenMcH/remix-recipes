import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <Form action="/recipe" method="get">
        <label>
          URL: <input type="text" name="url" required className="border-2 rounded p-2 w-96" />
        </label>
      </Form>
    </main>
  );
}
