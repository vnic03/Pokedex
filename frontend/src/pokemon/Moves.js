import React, {useEffect, useMemo, useState} from "react";
import {capitalize} from "./PokemonDetail";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan} from "@fortawesome/free-solid-svg-icons/faBan";


// TODO: Search for ar move -> nach name oder typ

function Moves({ names }) {
    const [allMoves, setAllMoves] = useState([]);
    const [moves, setMoves] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const moveNames = useMemo(() => {
        return names.split(/[;,]+/).map(name => name.trim()).filter(name => name !== "");
    }, [names]);

    useEffect(() => {
        const fetchMove = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/moves?names=${moveNames.join(',')}`
                );
                const data = await response.json();

                const filteredMoves = data.filter(move =>
                    moveNames.map(name => name.toLowerCase()).includes(move.name.toLowerCase())
                );

                setAllMoves(filteredMoves);
                setMoves(filteredMoves.slice(0, 3));

            } catch (error) { console.error("Error fetching move details", error); }
        };

        fetchMove();

    }, [moveNames]);


    const handleShowMore = () => {
        setShowAll(true);
        setMoves(allMoves);
    }

    const handleShowLess = () => {
        setShowAll(false);
        setMoves(allMoves.slice(0, 3));
    }

    const textStyle = {
        fontSize: '18px',
        fontWeight: 'bold'
    }

    return (
        <div className="pokemon-moves bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-2">Moves</h2>
            {moves.map((move, index) => (
                <div key={index}
                     className="move-row mb-2 flex justify-between items-center p-2 bg-gray-700 rounded whitespace-nowrap"
                     style={{borderRadius: '20px'}}>

                    <span className="move-name" style={textStyle}>{capitalize(move.name)}</span>

                    <img src={`/assets/types/${move.type}.png`} alt={move.type}
                         style={{width: '180px', height: '80px', objectFit: 'cover'}}/>

                    <img src={`assets/categories/${move.category}.png`} alt={move.category}
                         style={{width: '180px', height: '80px', objectFit: 'cover'}}/>

                    <span className="move-power" style={textStyle}>Power: {move.power ? move.power :
                        <FontAwesomeIcon icon={faBan}/>}</span>

                    <span className="move-accuracy" style={textStyle}>Accuracy: {move.accuracy ? move.accuracy :
                        <FontAwesomeIcon icon={faBan}/>}</span>

                    <span className="move-pp" style={textStyle}>PP: {move.pp}</span>

                    <span className="move-effect" style={{
                        ...textStyle,
                        cursor: move.short_effect.length > 40 ? 'help' : 'default'
                    }}
                          title={move.short_effect.length > 40 ? move.short_effect : ''}
                    >
                        {move.short_effect.slice(0, 40) + (move.short_effect.length > 40 ? '. . .' : '')}
                    </span>

                </div>
            ))}

            {!showAll && allMoves.length > 3 && (
                <button
                    onClick={handleShowMore}
                    className="see-more-btn bg-blue-500 text-white p-2 rounded-md mt-2"
                >
                    See More
                </button>
            )}
            {showAll && (
                <button
                    onClick={handleShowLess}
                    className="see-less-btn bg-red-500 text-white p-2 rounded-md mt-2"
                >
                    See Less
                </button>
            )}
        </div>
    );
}

export default Moves;