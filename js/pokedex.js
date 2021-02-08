//start pokedex

/**
 * basic pokemon object for use within the pokedex. Stores basic or necessary information about a pokemon from the API.
 * @param {string} name name of the pokemon
 * @param {number} id of the pokemon
 * @param {} moves moves stores an array of all possible moves a pokemon can do. These are currently stored raw.
 * @param {} sprites stores an array with links to sprites that can be useful in displaying the pokemon in question.
 * @constructor
 */
let Pokemon = function (name, id, moves, sprites)
{
    this.name = name;               //this pokemon's name
    this.id = id;                   //this pokemon's ID
    this.moves = moves;             //contains all the moves this pokemon has/can learn
    this.sprites = sprites;         //stores sprites
    this.mainArt = sprites.other['official-artwork'].front_default;      //link to official artwork
}

/**
 * use this function to easily get a new pokemon from the pokeapi API
 * @param {number/string} id accepts either a pokemon name or ID, and will try to fetch the proper data from the API.
 * @returns {Promise<Pokemon>} returns the desired pokemon as a Pokemon object.
 * @constructor
 */
Pokemon.FetchPokemon = async function (id)
{
    let data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    data = await data.json();
    return new Pokemon(data.name, data.id, data.moves, data.sprites);
}

/**
 * intended to get the total amount of pokemon within the API, in
 * @returns {Promise} returns the count of pokemon within the API
 * @constructor
 */
Pokemon.GetPokemonCount = async function ()
{
    let data = await fetch("https://pokeapi.co/api/v2/pokemon/");
    data = await data.json();

    // console.log(data.count);
    return data.count;
}

/**
 * returns raw species data from pokeAPI about the species. mostly instrumental in fetching the evolution chain of a specific pokemon.
 * @returns {Promise<*|Response>}
 * @constructor
 */
Pokemon.prototype.GetSpecies = async function ()
{
    let speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.id}/`);
    speciesData = await speciesData.json();
    // console.log(speciesData);
    return speciesData;
}

/**
 *!!!IN PROGRESS!!!
 * returns name of previous evolution of a pokemon. Will complain if there is no previous evolution. ignore for now, still working on it.
 * @returns {Promise<*>}
 * @constructor
 */
Pokemon.prototype.GetPrevEvolution = async function ()
{
    try {
        let data = await this.GetSpecies();
        let name = data.evolves_from_species.name;
        // console.log(name);
        return name;
    } catch (err) {
        return null;
    }
}

// /**
//  * !!!IN PROGRESS!!!
//  * gets the next links in the evolution chain and returns as array of pokemon objects
//  * @returns {Promise<*>}
//  * @constructor
//  */
// Pokemon.prototype.GetNextEvolutions = async function()
// {
//     let data = await this.GetEvolutionChain();
//     console.table(data.chain.evolves_to);
//     return data.chain.evolves_to;
// }

/**
 * !!!IN PROGRESS!!!
 * returns the evolution chain data of the Pokemon in question
 * TODO: rewrite this to instead return an array of pokemon objects rather than just the raw JSON data
 * @returns {Promise<*|Response>}
 * @constructor
 */
Pokemon.prototype.GetEvolutionChain = async function ()
{
    let speciesId = await this.GetSpecies();
    let evolutionData = await fetch(speciesId.evolution_chain.url);
    //console.log(evolutionData);
    evolutionData = await evolutionData.json();
    return evolutionData;
}

//start actual pokedex
let input = document.getElementById("userInput");
document.getElementById("submit").addEventListener("click", () =>
{
    //get pokemon based on user input
    (async () =>
    {
        //wait until we get a fresh pokemon from the API
        let newPokemon;
        newPokemon = await Pokemon.FetchPokemon(input.value)

        //we have retrieved the data of a new pokemon, now we can use this data for our pokedex
        //USE POKEMON DATA IN POKEDEX HERE
        console.log(newPokemon.name);
        console.log(newPokemon.id);
        //DONE USING POKEMON DATA FOR POKEDEX



        //get previous evolution of this pokemon
        newPokemon.GetPrevEvolution();


    })();


})