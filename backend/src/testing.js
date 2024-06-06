

/*
    TODO: Delete this when website is Done
 */


import fetchMove from "./api/moveapi.js";
import fetchPokemon, {fetchPokemonForm} from "./api/pokeapi.js";

import fetchItem from "./api/itemapi.js";



async function printMoveData(id) {
    try {
        const move = await fetchMove(id);
        console.log(move);
    } catch (e) {
        console.error('Error fetching move:', e.message);
    }
}

// printMoveData(15);


async function item(id) {
    console.log(await fetchItem(id));
}

// item("kelpsy-berry");

async function displayPokemon(id) {
    try {
        const pokemon = await fetchPokemon(id);
        // console.log(pokemon);
        console.log(pokemon.base_stats);
    } catch (error) {
        console.error('Error fetching Pokémon:', error.message);
    }
}

// displayPokemon(161);
