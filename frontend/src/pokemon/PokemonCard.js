import React, { useState, useRef } from "react";
import './/../styles/types.css';



function PokemonCard({ pokemon, onClick }) {
    const cardRef = useRef(null);

    const id = '#' + pokemon.pokedex_id.toString().padStart(4, '0');
    const name = C(pokemon.name_en);
    const backgroundColor = colors[pokemon.color] || "#374151";
    const types = pokemon.types.split('; ');

    const [spriteIndex, setSpriteIndex] = useState(0);
    const sprites = JSON.parse(pokemon.sprites);
    const toggleSprites = () => setSpriteIndex(spriteIndex === 0 ? 1 : 0);

    const legendaryOrMythical = pokemon.legendary_or_mythical;

    const generation = generations[pokemon.generation];

    return (
        <div ref={cardRef} className="p-4 rounded-lg border border-dark-accent shadow-lg overflow-hidden bg-dark-lighter relative" onClick={() => onClick(pokemon)}>
            <button onClick={(e) => {
                e.stopPropagation();
                toggleSprites();
            }} className="absolute top-2 right-2">
                <img src="/assets/shiny-symbol.png" className="w-12 h-12" alt='Toggle Shiny' />
            </button>

            <div style={{
                backgroundColor,
                borderRadius: '50%',
                width: '215px',
                height: '220px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                marginTop: '0px',
                zIndex: 1,
                overflow: 'visible'
            }}>
                <img className="w-full h-full object-contain rounded-full" src={sprites[spriteIndex]} alt={name} />
            </div>

            <div className="p-3 flex justify-between items-center">
                <h5 className="mb-1 text-lg font-bold tracking-tight text-white">{name}</h5>
                <span className="text-lg font-bold" style={{color: backgroundColor}}>{generation}</span>
            </div>

            <p className="font-normal text-dark-gray">{id}</p>

            <div className="flex justify-center items-center">
                {types.map(type => (
                    <div key={type} className={`icon ${type.trim()}`}>
                        <img src={`/assets/types/${type.trim()}.svg`} alt={type} />
                    </div>
                ))}
            </div>
            {legendaryOrMythical !== "0" && (
                <img src={`/assets/${legendaryOrMythical}.png`} className="absolute bottom-2 left-2 w-10 h-10" alt={''} />
            )}
        </div>
    );
}

const C = (name) => {
    const words = name.replace(/-/g, '. ').split(' ');
    const fWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return fWords.join(' ');
}


const colors = {
    green: "#A5D6A7",
    red: "#EF9A9A",
    blue: "#90CAF9",
    white: "#FFFFFF",
    brown: "#BCAAA4",
    yellow: "#FFF59D",
    purple: "#CE93D8",
    pink: "#F48FB1",
    gray: "#CFD8DC",
    black: "#B0BEC5"
};

const generations = {
    '1': 'First Gen',
    '2': 'Second Gen',
    '3': 'Third Gen',
    '4': 'Fourth Gen',
    '5': 'Fifth Gen',
    '6': 'Sixth Gen',
    '7': 'Seventh Gen',
    '8': 'Eighth Gen',
    '9': 'Ninth Gen'
};

export { colors, C };

export default PokemonCard;