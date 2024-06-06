import React, { useState, useEffect } from "react";
import PokemonList from "./pokemon/PokemonList";
import PokemonDetail from "./pokemon/PokemonDetail";
import { Tooltip } from 'react-tooltip';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TeamBuilder from "./teambuilder/TeamBuilder";

/*
 TODO: Anzeigen-Filter einbauen welche man anzeigen will!
    -> Sortiert nach - Gen, types, was anderes noch ?
 */

function App() {
    const [activePokemon, setActivePokemon] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const handlePokemonClick = (pokemon) => {
        setScrollPosition(window.scrollY);
        setActivePokemon(pokemon);
    };

    const handleBackClick = () => {
        setActivePokemon(null);
    };

    useEffect(() => {
        if (activePokemon === null && scrollPosition !== 0) {
            window.scrollTo(0, scrollPosition);
        }
    }, [activePokemon, scrollPosition]);

    return (
        <Router>
            <div className="App">
                <Link to="/team-builder">
                    {/*TODO: Button stylen position fixen,  mit den filter button uberseinstimmen spaeter*/}
                    <button className="team-builder-button">Team Builder</button>
                </Link>
                <Routes>
                    <Route path="/" element={
                        <>
                            <PokemonList onPokemonClick={handlePokemonClick} />
                            {activePokemon && (
                                <div className="modal-overlay">
                                    <div className="modal">
                                        <PokemonDetail pokemon={activePokemon} onBackClick={handleBackClick} />
                                    </div>
                                </div>
                            )}
                        </>
                    } />
                    <Route path="/team-builder" element={<TeamBuilder />} />
                </Routes>
                <Tooltip className="custom-tooltip" effect="solid" />
            </div>
        </Router>
    );
}

export default App;
