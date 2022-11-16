import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getRecipe } from "~/services/recipe.server";
import invariant from "tiny-invariant";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchUrl = url.searchParams.get("url");

  invariant(searchUrl, 'Must provide url')

  const recipes = await getRecipe(searchUrl)

  return json({
    recipes
  })
}

export default function RecipePage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col items-center">
      <h1 className="font-bold text-3xl">{data.recipes.name}</h1>
      <section className="flex gap-8">
        <p> Cook Time {data.recipes.cookTime} </p>
        <p> Prep Time {data.recipes.prepTime} </p>
      </section>
      <main className="flex bg-white gap-8">
        <section className="max-w-md">
          Ingredients:
          <ul className="list-disc">
            {data.recipes.ingredients.map(text => <li>{text}</li>)}
          </ul>
        </section>
        <section className="max-w-md">
          Instructions:
          <ol className="list-decimal">
            {data.recipes.instructions.map(text => <li>{text}</li>)}
          </ol>
        </section>
      </main>
      <div>
        <img alt={data.recipes.name} src={data.recipes.image} />
      </div>
    </div>
  );
}
