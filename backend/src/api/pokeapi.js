import fetch from 'node-fetch';
import Pokemon from '../model/pokemon.js';


async function fetchPokemon(id) {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );

        const data = await response.json();
        const speciesData = await speciesResponse.json();

        const name_other = speciesData.names.map(
            e => `${e.name} (${e.language.name})`);

        const types = data.types.map(e => e.type.name);

        const gender_rate = speciesData.gender_rate;
        const gender_ratio = gender_rate === -1 ? "Genderless" :
            `Female: ${(gender_rate / 8) * 100}% / Male: ${(1 - gender_rate / 8) * 100}%`;

        const sprites = [
            data.sprites.other['official-artwork'].front_default,
            data.sprites.other['official-artwork'].front_shiny,
            data.sprites.front_default,
            data.sprites.front_shiny,
            data.sprites.versions['generation-viii']['icons'].front_default
        ];

        const abilities = await fetchAbility(data.abilities);

        const base_stats = data.stats.reduce((acc, cur) => {
            acc[cur.stat.name] = cur.base_stat;
            return acc;
        }, {});

        const moves = data.moves.map(e => e.move.name);

        const evolutions = await fetchEvolutionChain(id);

        const category = extractEn(speciesData.genera);

        const egg_groups = speciesData.egg_groups.map(e => e.name);

        const color = speciesData.color.name;

        const generation = roman(speciesData.generation.name.split("-").pop());

        const pokemon_descriptions = await fetchPokedexEntry(id);

        const legendary_or_mythical = speciesData.is_legendary ? 'legendary'
            : (speciesData.is_mythical ? 'mythical'
                : false
            );

        return new Pokemon({
            id,
            name_en: data.name,
            name_other: name_other,
            pokedex_id: id,
            types,
            gender_ratio: gender_ratio,
            sprites,
            cry: data.cries.latest,
            abilities,
            base_stats: base_stats,
            moves,
            evolutions,
            weight: data.weight,
            height: data.height,
            category,
            color,
            generation,
            egg_groups,
            pokemon_descriptions,
            legendary_or_mythical
        });

    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to process Pokémon data');
    }
}

const fetchPokemonForm = async (id) => {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const data = await response.json();

        const getOriginalId = (url) => {
            const matches = url.match(/\/(\d+)\/$/);
            return matches ? parseInt(matches[1]) : null;
        }
        return {
            id: data.id,
            name_en: data.name,
            types: data.types.map(e => e.type.name),
            sprites: JSON.stringify({
                normal: data.sprites.other['official-artwork'].front_default,
                shiny: data.sprites.other['official-artwork'].front_shiny
            }),
            original_pokemon_id: getOriginalId(data.species.url)
        }
    } catch (error) {
        console.error(`Failed to fetch data for Pokemon form ID ${id}:`, error);
        return null;
    }
};

async function fetchAbility(abilities) {
    const results = [];
    for (const element of abilities) {
        const response = await fetch(
            `https://pokeapi.co/api/v2/ability/${element.ability.name}`
        );
        const data = await response.json();
        const description = data.effect_entries.find(
            entry => entry.language.name === 'en')?.effect || '';

        results.push({
            name: element.ability.name,
            description,
            isHidden: element.is_hidden
        });
    }
    return results;
}

async function fetchEvolutionChain(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const data = await response.json();

    const evolutionChainUrl = data.evolution_chain.url;
    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    return collectEC(evolutionData.chain);
}

const collectEC = (chain, path = "") => {
    let evolutions = [];
    const current = path ? `${path}, ${chain.species.name}` : chain.species.name;

    if (chain.evolves_to.length) {
        chain.evolves_to.forEach(
            next => evolutions = evolutions.concat(collectEC(next, current))
        );

    } else evolutions.push(current);

    return evolutions;
}

const roman = (str) => {
    const r = {
        'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
        'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9
    };
    return r[str.toLowerCase()] || 0;
}

const extractEn = (genera) => {
    const genus = genera.find(g => g.language.name === 'en');
    return genus ? genus.genus : 'Unknown';
}

async function fetchPokedexEntry(id) {
    try {
        const speciesUrl = (await (await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        )).json()).species.url;
        const speciesData = await (await fetch(speciesUrl)).json();

        const descriptions = new Map();
        speciesData.flavor_text_entries.forEach(entry => {
            if (entry.language.name === 'en' && !['firered', 'leafgreen'].includes(entry.version.name)) {
                descriptions.set(entry.version.name, entry.flavor_text.replace(/[\n\f]/g, ' '));
            }
        });

        return descriptions;
    } catch (error) {
        console.error('Error while getting pokedex descriptions:', error);
        return null;
    }
}

export {fetchPokemonForm};

export default fetchPokemon;
