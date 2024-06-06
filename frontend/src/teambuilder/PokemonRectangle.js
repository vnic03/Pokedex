import React, { useMemo } from 'react';
import { capitalize } from '../pokemon/PokemonDetail';

// TODO: styles komplette berabeiten

function PokemonRectangle({ pokemon }) {
    const icon = useMemo(() => {
        const i = JSON.parse(pokemon.sprites);
        return i[4];
    }, [pokemon.sprites]);

    const types = pokemon.types.split(';').map(type => type.trim());

    const a = JSON.parse(pokemon.abilities);
    const abilities = a.map(ability => ability.name);

    const stats = JSON.parse(pokemon.base_stats);

    return (
        <div className="bg-white rounded-lg shadow p-4 flex items-center mb-4 w-full">
            <img src={icon} alt={pokemon.name_en} className="w-20 h-20 mr-4"/>
            <div className="flex flex-col mr-4">
                <h2 className="text-xl font-bold">{capitalize(pokemon.name_en)}</h2>
            </div>
            <div className="flex flex-col mr-4">
                <div className="flex space-x-2 mt-2">
                    {types.map((type, i) => (
                        <span key={i}
                              className={`${typeColors[type]} rounded px-2 py-1 text-sm text-white`}>
                        {type.toUpperCase()}
                    </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col mr-4">
                <ul>
                    {abilities.map((ability, i) => (
                        <li key={i} className="text-sm">{capitalize(ability)}</li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col">
                <ul className="flex space-x-4">
                    <li className="text-sm">HP: {stats.hp}</li>
                    <li className="text-sm">Atk: {stats.attack}</li>
                    <li className="text-sm">Def: {stats.defense}</li>
                    <li className="text-sm">SpA: {stats['special-attack']}</li>
                    <li className="text-sm">SpD: {stats['special-defense']}</li>
                    <li className="text-sm">Spe: {stats.speed}</li>
                </ul>
            </div>
        </div>
    );


}

const typeColors = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-green-700',
    rock: 'bg-gray-700',
    ghost: 'bg-indigo-900',
    dragon: 'bg-purple-900',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
};

export default PokemonRectangle;
