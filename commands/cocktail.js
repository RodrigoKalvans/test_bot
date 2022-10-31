const { SlashCommandBuilder } = require('discord.js');
const dotenv = require("dotenv");
dotenv.config();

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.api_key,
        'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
    }
};

module.exports = {
    data: new SlashCommandBuilder()
            .setName("cocktail")
            .setDescription("reply with a random cocktail from db"),
        async execute(interaction, username) {
            const res = await sendDrink();
            await interaction.reply(res);
        }
}

async function sendDrink() {
    const res = await fetch('https://the-cocktail-db.p.rapidapi.com/filter.php?a=Alcoholic', options)

    // error check
    if (!res.ok) {
        console.log(res)
        return null
    }
    const drinksObject = await res.json() 

    const drinks = drinksObject.drinks

    var index = Math.floor(Math.random() * drinks.length) // random index in array bounds
    var name = drinks[index].strDrink

    var r = `Try out ${name} \n\n` + `It contains: \n${await getIngredients(name)}`

    return r
}

async function getIngredients(name) {
    const res = await fetch(`https://the-cocktail-db.p.rapidapi.com/search.php?s=${name}`, options)

    // error check
    if (!res.ok) {
        console.log(res)
        return null
    }

    const drinkObject = await res.json()
    const drink = drinkObject.drinks[0]

    // get ingredients
    var ingredients = []
    for (const property in drink) {
        if (property.substring(0, 13) == "strIngredient" && drink[property] !== null) 
            ingredients.push(drink[property])
    }

    // format return string
    var result = ``
    for (const i in ingredients) {
        result += `${ingredients[i]}\n`
    }

    return result
}