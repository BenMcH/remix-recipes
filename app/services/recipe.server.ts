import invariant from "tiny-invariant"
import { load } from "cheerio"
import * as tinyduration from 'tinyduration'

type LdType = {
	'@type': string | Array<string>
	name: string
	description: string
	recipeIngredient: Array<string>
	recipeInstructions: Array<{ text: string }>
	prepTime: string
	cookTime: string
	image: string | Array<string>
}

export async function getRecipe(url: string) {
	invariant(url, "Must provide a url")

	const response = await fetch(url).then(res => res.text())

	const scraped = load(response)

	const element = scraped('script[type="application/ld+json"]:contains("Recipe)')

	invariant(element.length === 1, "The scraped page does not have a script containing application/ld+json recipe data")

	const ldJson: Array<LdType> | (LdType & { '@graph': undefined }) | { '@graph': Array<LdType>, '@type': never } = JSON.parse(element.text())

	invariant(ldJson, "ldJson cannot be undefined")

	let recipe: LdType | undefined;
	if (Array.isArray(ldJson)) {
		recipe = ldJson.find((elem) => elem['@type'].includes('Recipe'))
	} else if (ldJson['@graph']) {
		recipe = ldJson['@graph'].find((elem) => elem['@type'].includes('Recipe'))
	} else if (ldJson['@type'].includes('Recipe')) {
		recipe = ldJson;
	}

	invariant(recipe, 'The scraped ld+json data did not contain a receipe')

	console.log({ rawRecipe: recipe });

	const returnedRecipe = {
		originalUrl: url,
		name: recipe.name,
		description: recipe.description,
		ingredients: recipe.recipeIngredient,
		instructions: recipe.recipeInstructions.map(instruction => instruction.text),
		prepTime: durationStringToHumanString(recipe.prepTime),
		cookTime: durationStringToHumanString(recipe.cookTime),
		image: Array.isArray(recipe.image) ? recipe.image[0] : recipe.image
	}

	return returnedRecipe
}


function durationStringToHumanString(durationString: string) {
	console.log({ durationString })
	const duration = tinyduration.parse(durationString);

	let values = []

	if (duration.days) values.push(`${duration.years} day${duration.days !== 1 ? 's' : ''}`)
	if (duration.hours) values.push(`${duration.hours} hour${duration.hours !== 1 ? 's' : ''}`)
	if (duration.minutes) values.push(`${duration.minutes} minute${duration.minutes !== 1 ? 's' : ''}`)

	return values.join(' ')
}
