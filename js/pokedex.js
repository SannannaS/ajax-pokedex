//start pokedex

/**
 * basic pokemon object for use within the pokedex. Stores basic or necessary information about a pokemon from the API.
 * @param {string} name name of the pokemon
 * @param {number} id of the pokemon
 * @param {Array} moves moves stores an array of all possible moves a pokemon can do. These are currently stored raw.
 * @param {Array} sprites stores an array with links to sprites that can be useful in displaying the pokemon in question.
 * @param {number} height stores pokemon height
 * @param {number} weight stores pokemon weight
 * @constructor
 */
let Pokemon = function (name, id, moves, sprites, height, weight)
{
    this.name = name;               //this pokemon's name
    this.id = id;                   //this pokemon's ID
    this.moves = moves;             //contains all the moves this pokemon has/can learn
    this.sprites = sprites;         //stores sprites
    this.mainArt = sprites.other['official-artwork'].front_default;      //link to official artwork

    this.height = height;
    this.weight = weight;
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
    return new Pokemon(data.name, data.id, data.moves, data.sprites, data.height, data.weight);
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
 * NOTE: if the pokemon in question has no evolutions, this function will just return null
 *  * @returns {Promise<*|Response>}
 * @constructor
 */
Pokemon.prototype.GetEvolutions = async function ()
{
    //get evolution chain object
    let evoArray = [[], [], []];
    let species = await this.GetSpecies();
    let evoChain = await fetch(species.evolution_chain.url);
    evoChain = await evoChain.json();
    evoChain = evoChain.chain;
    //first, check if the pokemon has any evolutions to begin with
    //if not, return null
    if (evoChain.evolves_to.length === 0) {
        console.log("no evolutions!");
        return null;
    }

    //figure out first pokemon in the chain and add to chain
    //because the first pokemon in the chain is NEVER an array (it is known) we can't loop through it.
    if (evoChain.species.name.toLowerCase() === this.name) {
        evoArray[0].push(this);
    }
    else {
        evoArray[0].push(await Pokemon.FetchPokemon(evoChain.species.name));
    }

    //retrieve the next 2 links in the chain
    evoChain = evoChain.evolves_to;
    for (let i = 0; i < evoChain.length; i++) {
        evoArray[1].push(await Pokemon.FetchPokemon(evoChain[i].species.name));
        for (let j = 0; j < evoChain[i].evolves_to.length; j++) {
            evoArray[2].push(await Pokemon.FetchPokemon(evoChain[i].evolves_to[j].species.name));
        }

    }

    return evoArray;
    //start parsing the evo chain
}

Pokemon.prototype.GetFrontSpriteUrl = function ()
{
    return this.sprites.front_default;
}

Pokemon.prototype.GetFrontShinySpriteUrl = function ()
{
    return this.sprites.front_shiny;
}

/**
 *
 * @param {number/string}pokemon
 * @constructor
 */
const UpdatePokedexDisplay = async function (searchIndex)
{

    let currentPokemon;
    currentPokemon = await Pokemon.FetchPokemon(searchIndex);
    currentIndex = currentPokemon.id;
    //set main Pokemon data
    mainPokemonDsp.setAttribute("src", currentPokemon.mainArt);
    mainPokemonDsp.style.visibility = "visible";

    nameDsp.innerText = currentPokemon.name;
    idDsp.innerText = currentPokemon.id.toString();

    heightDsp.innerText = currentPokemon.height.toString();
    weightDsp.innerText = currentPokemon.weight.toString();

    //set move names
    let moveArray = currentPokemon.GetMoves(moveDsps.length, true);
    for (let i = 0; i < moveDsps.length; i++) {
        moveDsps[i].innerText = moveArray[i];
    }
    //get evolution chain data
    let evolutionChain = await currentPokemon.GetEvolutions();
    if (evolutionChain != null) {

        //check if there's a first evolution
        if(evolutionChain[0][0])
        {
            let firstLink = evolutionChain[0][0];
            firstLinkId = firstLink.id;
            evolutionDsps[0].setAttribute("src", firstLink.GetFrontSpriteUrl());
            evolutionDsps[0].style.visibility = "visible";
        }
        else
        {
            evolutionDsps[0].style.visibility = "hidden";
        }

        // if(evolutionChain[1].length < 2 && evolutionChain[1] != null)
        // {
        //     for(let i = 0; i < evolutionChain[1].length; i++){
        //
        //     }
        // }

        if(evolutionChain[1].length < 2 && evolutionChain[1].length > 0)
        {
            let secondLink = evolutionChain[1][0]
            secondLinkId = secondLink.id;
            evolutionDsps[1].setAttribute("src", secondLink.GetFrontSpriteUrl());
            evolutionDsps[1].style.visibility = "visible";
            evoArrows[0].style.visibility = "visible";
        }
        else
        {
            evolutionDsps[1].style.visibility = "hidden";
            evoArrows[0].style.visibility = "hidden";
        }

        if(evolutionChain[2].length < 2 && evolutionChain[2].length > 0)
        {
            let thirdLink = evolutionChain[2][0]
            thirdLinkId = thirdLink.id;
            evolutionDsps[2].setAttribute("src", thirdLink.GetFrontSpriteUrl());
            evolutionDsps[2].style.visibility = "visible";
            evoArrows[1].style.visibility = "visible";
        }
        else
        {
            evolutionDsps[2].style.visibility = "hidden";
            evoArrows[1].style.visibility = "hidden";
        }

    }
    else {
        for (let display of evolutionDsps) {
            display.style.visibility = "hidden";

        }
        for (let arrow of evoArrows) {
            arrow.style.visibility = "hidden";
        }
    }


    // console.table(evolutionChain);
}


//==========================\\
//===start actual pokedex===\\
//==========================\\

const MAX_POKEMON = 898;
let currentIndex = 1;
let firstLinkId;
let secondLinkId;
let thirdLinkId;
let input = document.getElementById("pokemon-name");
let nameDsp = document.getElementById("poke-display__name");
let idDsp = document.getElementById("poke-display__id");
let heightDsp = document.getElementById("poke-display__height");
let weightDsp = document.getElementById("poke-display__weight");

let moveDsps = document.getElementsByClassName("move");
let evolutionDsps = document.getElementsByClassName("poke-front-sprite");
let evoArrows = document.getElementsByClassName("poke-arrow");

let mainPokemonDsp = document.getElementById("poke-display__img__front");

evolutionDsps[0].addEventListener("click", () =>
{
    (async () =>
    {
        try {
            await UpdatePokedexDisplay(firstLinkId);
        } catch (err) {
            console.error("your link's broken I guess");
        }
    })();
});
evolutionDsps[1].addEventListener("click", () =>
{
    (async () =>
    {
        try {
            await UpdatePokedexDisplay(secondLinkId);
        } catch (err) {
            console.error("your link's broken I guess");
        }
    })();
});
evolutionDsps[2].addEventListener("click", () =>
{
    (async () =>
    {
        try {
            await UpdatePokedexDisplay(thirdLinkId);
        } catch (err) {
            console.error("your link's broken I guess");
        }
    })();
});


document.getElementById("search-button").addEventListener("click", () =>
{
    //get pokemon based on user input
    (async () =>
    {
        try {
            await UpdatePokedexDisplay(input.value);
        } catch (err) {
            console.error("Pokemon not found!")
        }

    })();

})

document.getElementById("button-A").addEventListener("click", () =>
{
    (async () =>
    {
        currentIndex++;

        if (currentIndex > MAX_POKEMON) currentIndex = 1;
        UpdatePokedexDisplay(currentIndex);
    })();
})

document.getElementById("button-B").addEventListener("click", () =>
{
    (async () =>
    {
        currentIndex--;
        if (currentIndex < 1) currentIndex = MAX_POKEMON;
        UpdatePokedexDisplay(currentIndex);
    })();
})

document.getElementById("reset-button").addEventListener("click", () =>
{
    //reset EVERYTHING
    input.value = "";
    mainPokemonDsp.style.visibility = "hidden";
    mainPokemonDsp.setAttribute("src", "");
    nameDsp.innerText = "";
    idDsp.innerText = "";
    heightDsp.innerText = "";
    weightDsp.innerText = "";
});