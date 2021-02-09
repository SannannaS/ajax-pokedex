//start pokedex

/**
 * basic pokemon object for use within the pokedex. Stores basic or necessary information about a pokemon from the API.
 * @param {string} name name of the pokemon
 * @param {number} id of the pokemon
 * @param {} moves moves stores an array of all possible moves a pokemon can do. These are currently stored raw.
 * @param {} sprites stores an array with links to sprites that can be useful in displaying the pokemon in question.
 * @constructor
 */
const Pokemon = function (name, id, moves, sprites)
{
    this.name = name;               //this pokemon's name
    this.id = id;                   //this pokemon's ID
    this.moves = moves;             //contains all the moves this pokemon has/can learn
    this.sprites = sprites;         //stores sprites
    this.mainArt = sprites.other['official-artwork'].front_default;      //link to official artwork

    this.height
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
 * This function parses through the moves array of the pokemon and returns the names of a specified amount.
 * @param {number} moveCount the amount of moves to return in the final array. If the desired amount is larger than the actual moves, the array will fill itself up with X es
 * @param {boolean} selectRandom whether the moves picked from the movelist should be random. If the desired amount is larger than the actual moves, this will be ignored
 * @returns {[]} returns an array of names
 * @constructor
 */
Pokemon.prototype.GetMoves = function (moveCount = 4, selectRandom = false)
{
    let moveArray = [];
    if (this.moves.length > moveCount) {
        for (let i = 0; i < moveCount; i++) {
            let index = i;
            if (selectRandom) index = Math.random() * this.moves.length | 0;

            moveArray.push(this.moves[i].move.name);
        }
    }
    else {
        for (let i = 0; i < moveCount; i++) {
            if (this.moves[i] != null) {
                moveArray.push(this.moves[i].move.name);
            }
            else {
                moveArray.push("X");
            }
        }
    }


    return moveArray;
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
    let data = await this.GetSpecies();
    return Pokemon.FetchPokemon(data.evolves_from_species.name);
}

/**
 * !!!IN PROGRESS!!!
 *
 * returns the evolution chain data of the Pokemon in question in the form of a nested array
 * the horizontal array determines the length of the evolution array
 * the vertical array determines alternative evolutions at that stage of the evolution chain
 * this is primarily to work with Eevee and its plethora of evolutionary forms
 *  * @returns {Promise<*|Response>}
 * @constructor
 */
Pokemon.prototype.GetNextEvolutions = async function ()
{
    //get evolution chain object
    let evoArray = [[], [], []];
    let species = await this.GetSpecies();
    let evoChain = await fetch(species.evolution_chain.url);
    evoChain = await evoChain.json();
    evoChain = evoChain.chain;

    //figure out first pokemon in the chain and add to chain
    //because the first pokemon in the chain is NEVER an array (it is known) we can't loop through it.
    if (evoChain.species.name.toLowerCase() === this.name) {
        evoArray[0].push(this.name);
    }
    else {
        evoArray[0].push(evoChain.species.name);
    }

    //retrieve the next 2 links in the chain
    evoChain = evoChain.evolves_to;
    for (let i = 0; i < evoChain.length; i++) {
        evoArray[1].push(evoChain[i].species.name);
        for (let j = 0; j < evoChain[i].evolves_to.length; j++) {
            evoArray[2].push(evoChain[i].evolves_to[j].species.name);
        }

    }

    return evoArray;
    //start parsing the evo chain
}

Pokemon.prototype.GetFrontSpriteUrl = function()
{
    return this.sprites.front_default;
}

Pokemon.prototype.GetFrontShinySpriteUrl = function()
{
    return this.sprites.front_shiny;
}

//start actual pokedex
let input = document.getElementById("pokemon-name");
document.getElementById("search-button").addEventListener("click", () =>
{
    //get pokemon based on user input
    (async () =>
    {
        //wait until we get a fresh pokemon from the API
        let thisPokemon;
        thisPokemon = await Pokemon.FetchPokemon(input.value)

        //we have retrieved the data of a new pokemon, now we can use this data for our pokedex
        //USE POKEMON DATA IN POKEDEX HERE
        console.log(thisPokemon.name);
        console.log(thisPokemon.id);
        //DONE USING POKEMON DATA FOR POKEDEX

        //get previous evolution of this pokemon
        //if there is no previous evolution, catch the exception and handle it.
        let prevPokemon;
        await thisPokemon.GetPrevEvolution()
            .then((newPokemon) =>
            {
                prevPokemon = newPokemon;
                console.log(prevPokemon.name);
                console.log(prevPokemon.id);

            })
            .catch((err) =>
            {
                console.log("no prior evolution!");
            });
        console.log("...executing next job!");

        //return four moves of the pokemon in question
        console.log(thisPokemon.GetMoves(4, false));

        console.log(await thisPokemon.GetNextEvolutions());

        document.getElementById("poke-display__img__front").setAttribute("src",thisPokemon.mainArt);

    })();


})