import React from "react";

function PokemonInput({ setSearchTerm }) {
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start mb-4 w-full h-96 relative">
            <p className="text-md font-semibold mb-2 absolute bottom-6 left-4">Pokémon</p>
            <input
                type="text"
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-24 h-6 absolute bottom-2 left-4"
            />
        </div>
    );
}

export default PokemonInput;