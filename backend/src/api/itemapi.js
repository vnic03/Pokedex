import fetch from "node-fetch"
import Item from "../model/item.js";


async function fetchItem(name) {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/item/${name}`
        );
        const data = await response.json();

        const id = data.id;
        const sprite = data.sprites['default'];
        const description = data.effect_entries[0]['short_effect'];

        return new Item({ id, name, sprite, description });

    } catch (e) {
        console.error(`Error fetching move with ID ${id}:`, e.message);
    }
}

export default fetchItem;