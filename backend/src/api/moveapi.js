import fetch from "node-fetch";
import Move from "../model/move.js";

async function fetchMove(id) {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/move/${id}`
        );

        const data = await response.json();

        const short_effect = data.effect_entries && data.effect_entries.length > 0 ? data.effect_entries[0].short_effect : "No effect description :/";
        const effect = data.effect_entries && data.effect_entries.length > 0 ? data.effect_entries[0].effect : "No effect description :/";
        const name = data.name;
        const power = data.power;
        const accuracy = data.accuracy;
        const type = data.type && data.type.name;
        const pp = data.pp;
        const category = data.damage_class && data.damage_class.name;
        const priority = data.priority;
        const target = data.target && data.target.name;

        return new Move({
            id,
            name,
            power,
            accuracy,
            pp,
            type,
            category,
            short_effect,
            effect,
            priority,
            target
        });

    } catch (e) {
        console.error(`Error fetching move with ID ${id}:`, e.message);
    }
}


export default fetchMove;