//start pokedex

let Pokemon = function(name, id, moves, sprites)
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
 * @returns {Promise<Pokemon>}
 * @constructor
 */
Pokemon.FetchPokemon = async function(id)
{
    let data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    data = await data.json();

    let tempPokemon = new Pokemon(data.name, data.id, data.moves, data.sprites);
    return tempPokemon;

}

Pokemon.prototype.GetSpecies = async function()
{
    let speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.id}/`);
    speciesData = await speciesData.json();
    console.log(speciesData);
    return speciesData;

}

Pokemon.prototype.GetPrevEvolution = async function()
{

    let data = await this.GetSpecies();
    let name = data.evolves_from_species.name;
    console.log(name);
    return name;
}

/**
 * !!!IN PROGRESS!!!
 * gets the next links in the evolution chain and returns as array of pokemon objects
 * @returns {Promise<*>}
 * @constructor
 */
// Pokemon.prototype.GetNextEvolutions = async function()
// {
//     let data = await this.GetEvolutionChain();
//     console.table(data.chain.evolves_to);
//     return data.chain.evolves_to;
// }

Pokemon.prototype.GetEvolutionChain = async function()
{
    let speciesId = await this.GetSpecies();
    let evolutionData = await fetch(speciesId.evolution_chain.url);
    //console.log(evolutionData);
    evolutionData = await evolutionData.json();
    return evolutionData;

}