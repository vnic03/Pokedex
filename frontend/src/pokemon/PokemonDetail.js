import React, {useEffect, useRef, useState, useMemo} from "react";
import {colors, C} from "./PokemonCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlayCircle, faArrowCircleLeft, faArrowDown} from "@fortawesome/free-solid-svg-icons";

import Moves from "./Moves";

// TODO: sobald poekomn imag nicht merh zu sehen ist soll ein kleiner bild mit name und nummer
// die ganze zeit zu shen sein beim scrollen
// TODO: das shiny symbol soll auch beim scrollen mit runter kommen

// TODO: evolution cahin vershconeren (kreis machen, effekte)
// TODO: wenn man auf eine evolution kilckt soll man zu dieser datils page weiter geleitet werden

// TODO: Overall styles


function PokemonDetail({ pokemon, onBackClick }) {
    const audioRef = useRef(null);
    const [isShiny, setIsShiny] = useState(false);

    const toggleShiny = () => setIsShiny(!isShiny);

    const sprites = useMemo(() => {
        const a = JSON.parse(pokemon.sprites);
        return { normal: a[0], shiny: a[1] };
    }, [pokemon.sprites]);

    const Cry = () => { if (audioRef.current) audioRef.current.play(); }

    const types = pokemon.types.split(';').map(type => type.trim());

    return (
        <div className="pokemon-detail-page bg-gray-900 min-h-screen text-gray-200">
            <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden mx-5 my-10 p-5">
                <button onClick={onBackClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
                </button>

                <div className="pokemon-detail flex flex-col items-center">

                    <img src={isShiny ? sprites.shiny : sprites.normal} alt={pokemon.name_en}
                         className="pokemon-image-large mb-4 w-128 h-128 object-cover"/>

                    <button onClick={toggleShiny} className="border-none background-transparent">
                        <img src="/assets/shiny-symbol.png" alt="Toggle Shiny" className="w-10 h-10 mb-4"/>
                    </button>

                    <h1 className="text-xl font-bold mb-2">{`${C(pokemon.name_en)} #${pokemon.pokedex_id.toString().padStart(4, '0')}`}</h1>

                    <Types types={types}/>

                    <button onClick={Cry}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                        Cry <FontAwesomeIcon icon={faPlayCircle}/>
                    </button>

                    <audio ref={audioRef} src={pokemon.cry} preload="none"></audio>

                    <div className="w-full">
                        <PokemonForms id={pokemon.pokedex_id} isShiny={isShiny}/>
                    </div>

                    <div className="w-full mt-4">
                        <Info pokemon={pokemon}/>
                    </div>

                    <div className="w-full mt-4">
                        <Gender genderRatio={pokemon.gender_ratio}/>
                    </div>

                    <div className="w-full mt-4">
                        <Abilities json={pokemon.abilities}/>
                    </div>

                    <div className="w-full mt-4">
                        <BaseStats stats={pokemon.base_stats}/>
                    </div>

                    <div className="w-full mt-4">
                        <Moves names={pokemon.moves}/>
                    </div>

                    <div className="w-full mt-4">
                        <PokemonNames nameOther={pokemon.name_other}/>
                    </div>

                    <div className="w-full mt-4">
                        <EvolutionChain pokemon={pokemon} isShiny={isShiny}/>
                    </div>

                </div>
            </div>
        </div>
    );
}

function Types({types}) {
    return (
        <div className="pokemon-types flex justify-center gap-0">
            {types.map((type, i) => (
                <img key={i} src={`/assets/types/${type}.png`} alt={type} title={type}
                     className="type-icon"
                     style={{
                         width: '300px', height: '200px', objectFit: "contain",
                     }}
                />
            ))}
        </div>
    );
}

function PokemonForms({ id, isShiny }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/pokemon/forms/${id}`
                );
                if (!response.ok) return;

                const formData = await response.json();
                setData(formData.map(form => ({
                    ...form,
                    sprites: JSON.parse(form.sprites),
                    types: form.types.split(';').map(type => type.trim())
                })));
            } catch (error) {
                console.error('Failed to fetch pokemon forms:', error);
            }
        };

        fetchForms();
    }, [id]);

    const forms = useMemo(() => data, [data]);

    const format = (name) => {
        const parts = name.split('-');
        const prefix = parts.pop().toUpperCase();
        const baseName = parts.join(' ')
            .split(' ')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');

        return `${prefix} ${baseName}`;
    }

    if (forms.length === 0) return null;

    return (
        <div className="pokemon-forms bg-gray-800 text-white p-4 rounded-lg shadow-lg flex flex-wrap justify-center items-center">
            <h3 className="text-lg font-bold w-full text-center mb-4">Form Flux</h3>
            {forms.map((form, index) => (
                <div key={index}
                     className="p-4 m-3 rounded-lg border border-dark-accent shadow overflow-hidden bg-dark-lighter relative"
                     style={{minWidth: '350px', maxWidth: '400px', minHeight: '450px'}}>
                    <img src={isShiny ? form.sprites.shiny : form.sprites.normal} alt={form.name_en}
                         className="pokemon-form-image mb-2 w-full h-auto object-contain rounded-full"/>
                    <div className="text-center mb-2">
                        <p className="text-sm font-bold">{format(form.name_en)}</p>
                    </div>
                    <div className="flex justify-center">
                        {form.types.map((type, typeIndex) => (
                            <img key={typeIndex} src={`/assets/types/${type}.png`} alt={type}
                                 style={{width: '160px', height: '80px', objectFit: 'contain', margin: '0.5rem'}}/>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

}


function Info({pokemon}) {
    const {kg, lbs} = weight(pokemon.weight);
    const {meters, feet} = height(pokemon.height);

    const c = {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: colors[pokemon.color],
        display: 'inline-block'
    }

    return (
        <div className="pokemon-info bg-gray-800 text-white p-4 rounded-lg shadow-lg">

            {pokemon.legendary_or_mythical === 'legendary' && (
                <div className="info-row flex justify-between mb-2">
                    <span className="label font-bold">Legendary Pokémon</span>
                    <img src="/assets/legendary.png" alt="Legendary Icon" className="w-14 h-14"/>
                </div>
            )}
            {pokemon.legendary_or_mythical === 'mythical' && (
                <div className="info-row flex justify-between mb-2">
                    <span className="label font-bold">Mythical Pokémon</span>
                    <img src="/assets/mythical.png" alt="Mythical Icon" className="w-14 h-14"/>
                </div>
            )}

            <div className="info-row flex justify-between mb-2">
                <span className="label font-bold">Weight</span>
                <span className="value">{kg} kg / {lbs} lbs.</span>
            </div>

            <div className="info-row flex justify-between mb-2">
                <span className="label font-bold">Height</span>
                <span className="value">{meters} / {feet}"</span>
            </div>

            <div className="info-row flex justify-between mb-2">
                <span className="label font-bold">Category</span>
                <span className="value">{pokemon.category}</span>
            </div>

            <div className="info-row flex justify-between mb-2">
                <span className="label font-bold">Color</span>
                <div style={c}></div>
            </div>

            <div className="info-row flex justify-between mb-2">
                <span className="label font-bold">Generation</span>
                <span className="value">{pokemon.generation}</span>
            </div>

            <div className="info-row flex justify-between mb-2">
                <span className="label font-bold">Egg-Groups</span>
                <span className="value">{eggGroups(pokemon.egg_groups)}</span>
            </div>

        </div>
    );
}

const weight = (hg) => {
    const kg = parseFloat((hg * 0.1).toFixed(1));
    const lbs = parseFloat((hg * 0.1 * 2.20462).toFixed(1));
    return { kg: kg.toString(), lbs: lbs.toString() };
}

const height = (dm) => {
    const meters = parseFloat((dm * 0.1).toFixed(1));
    const feet = parseFloat((dm * 0.1 * 3.28084).toFixed(2));
    return { meters: `${meters}m`, feet: feet.toString() };
}

const eggGroups = (eggs) => {
    return eggs.split(';')
        .map(egg => egg.trim().charAt(0).toUpperCase() + egg.trim().slice(1).toLowerCase())
        .join(' / ');
}


function Gender({ genderRatio }) {
    if (genderRatio === "Genderless") return (
            <div className="gender-ratio bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold">Gender</h2>
                <h3 className="text-md">Unknown</h3>
            </div>
    );

    const [female, male] = genderRatio.split('/').map(ratio => {
        return parseFloat(ratio.split(':')[1].trim().replace('%', ''));
    });

    const message = female > male ? 'Female Majority' :
                    male > female ? 'Male Majority' :
                        'Balanced 50 / 50';
    return (
        <div className="gender-ratio bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Gender</h2>
            <h3 className="text-md">{message}</h3>
            <div className="w-full bg-gray-200 rounded overflow-hidden mt-2 mb-4 relative" style={{ borderRadius: '12px' }}>
                <div className="bg-pink-300 relative" style={{ width: `${female}%`, borderRadius: '12px 0 0 12px' }}>
                    <span className="text-xs font-medium text-pink-800 px-1">{female.toFixed(1)}%</span>
                </div>
                <div className="bg-blue-300 absolute top-0 left-0" style={{ width: `${male}%`, left: `${female}%`, borderRadius: '0 12px 12px 0' }}>
                    <span className="text-xs font-medium text-blue-800 px-1">{male.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
}


function PokemonNames({ nameOther }) {
    const names = getNames(nameOther);

    return (
        <div className="pokemon-names bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Names</h3>
            {names.map((entry, index) => (
                <div key={index} className="info-row flex justify-between mb-1">
                    <span className="label font-bold">{entry.code}</span>
                    <span className="value">{entry.name}</span>
                </div>
            ))}
        </div>
    );
}


const getNames = (name) => {
    const languages = {
        'roomaji': 'Japanese (Romaji)',
        'ko': 'Korean',
        'fr': 'French',
        'de': 'German',
        'es': 'Spanish',
        'it': 'Italian',
        'en': 'English',
        'ja': 'Japanese',
        'zh-Hans': 'Chinese'
    };

    const names = name.split(';').map(entry => {
        const codeMatch = entry.match(/\(([^)]+)\)/);
        const code = codeMatch ? codeMatch[1] : undefined;
        const namePart = entry.substring(0, codeMatch ? codeMatch.index : 0).trim();

        if (languages[code]) {
            return {
                code: languages[code],
                name: namePart || ''
            };
        }
        return null;
    }).filter(entry => entry);

    return names.sort((a, b) => a.code.localeCompare(b.code));
};


const capitalize = (str) => {
    return str.replace(/-/g, ' ').split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}


function Abilities({ json }) {
    const abilities = JSON.parse(json);

    return (
        <div className="pokemon-abilities bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Abilities</h3>
            {abilities.map((ability, index) => (
                <div key={index} style={{
                    borderBottom: '1px solid gray',
                    paddingBottom: '10px',
                    marginBottom: '10px'
                }} className="flex flex-col mb-2">
                    <span style={{
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                    }} className="ability-name font-bold">
                        {capitalize(ability.name)}{ability.isHidden ? ' (Hidden)' : ''}
                    </span>
                    <span style={{
                        fontSize: '0.9rem',
                        marginTop: '5px',
                        lineHeight: '1.6',
                    }} className="ability-description text-sm">
                        {ability.description.replace(/\\n/g, ' ')}
                    </span>
                </div>
            ))}
        </div>
    );
}

function BaseStats({ stats }) {
    const baseStats = JSON.parse(stats);
    const total = Object.values(baseStats).reduce(
        (sum, value) => sum + value, 0
    );

    const names = {
        hp: "HP",
        attack: "Attack",
        defense: "Defense",
        "special-attack": "Special Attack",
        "special-defense": "Special Defense",
        speed: "Speed"
    };

    const colors = {
        hp: "bg-red-500",
        attack: "bg-orange-500",
        defense: "bg-yellow-500",
        "special-attack": "bg-blue-500",
        "special-defense": "bg-green-500",
        speed: "bg-pink-500"
    };

    return (
        <div className="pokemon-stats bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Base Stats</h3>
            {Object.entries(baseStats).map(([key, value], index) => (
                <div key={index} className="stat-row mb-2">
                    <span className="stat-name font-bold">{names[key]} {value}</span>
                    <div className={`stat-bar ${colors[key]}`} style={{ width: `${value / 2}%`, height: '20px', borderRadius: '10px' }}></div>
                </div>
            ))}
            <div className="total-stats mt-3">
                <span className="font-bold">Total: {total}</span>
            </div>
        </div>
    );
}


// TODO: wenn pokeomn zwei entwicklungen hat, dann nichjt die vornetwicklung dopplet nazeigen lasen,
// sondern zwei pefeile vor den entwicklung auf beide versionen der entwentwicklung

function EvolutionChain({ pokemon, isShiny }) {
    const [evolutionData, setEvolutionData] = useState([]);

    useEffect(() => {
        const str = pokemon.evolutions.replace(/[\[\]"]+/g, '');

        const evolutions = str.split(',').map(name => name.trim());

        Promise.all(evolutions.map(name => fetchPokemon(name)))
            .then(data => {
                setEvolutionData(data);
                console.log("Fetched data:", data);
            })
            .catch(e => console.error('Error fetching evolution data:', e));
    }, [pokemon]);

    return (
        <div className="evolution-chain bg-gray-800 text-white p-4 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Evolutions</h3>
            <div className="flex flex-col items-center justify-center">
                {evolutionData.map((evolution, index) => (
                    <React.Fragment key={index}>
                        <img
                            src={isShiny ? JSON.parse(evolution.sprites)[1] : JSON.parse(evolution.sprites)[0]}
                            alt={evolution.name_en}
                            className="pokemon-image mb-4 w-80 h-80 object-cover rounded-full border-2 border-gray-300 shadow-2xl"
                            style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.2) inset' }}
                        />
                        {index < evolutionData.length - 1 && (
                            <FontAwesomeIcon icon={faArrowDown} className="text-gray-300 my-2" size="2x"/>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}


const fetchPokemon = (name) => {
    return fetch(`http://localhost:3000/pokemon/${name}`).then(response => {
        if (!response.ok) throw new Error('Network failed');
        return response.json();
    }).catch(e => {
        console.error('There was a problem with the fetch operation:', e);
        throw e;
    });
};


export {capitalize}

export default PokemonDetail;