import React, { useEffect, useState } from "react";
import PokemonRectangle from "./PokemonRectangle";
import PokemonInput from "./PokemonInput";

function TeamBuilder() {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPokemons(offset);
    }, [offset]);

    const fetchPokemons = (offset) => {
        setLoadingMore(true);
        fetch(`http://localhost:3000/pokemons/batch?offset=${offset}`)
            .then(response => {
                if (!response.ok) throw new Error('Response was not ok');
                return response.json();
            })
            .then(data => {
                setPokemonList(prevPokemons => {
                    const newPokemons = data.filter(
                        pokemon => !prevPokemons.some(p => p.id === pokemon.id)
                    );
                    return [...prevPokemons, ...newPokemons];
                });
                setLoading(false);
                setLoadingMore(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
                setLoadingMore(false);
            });
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore) {
            return;
        }
        setOffset(offset + 10); // TODO: change to 100
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore]);

    if (loading && offset === 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const filter = pokemonList.filter(p => p.name_en.toLowerCase().startsWith(searchTerm.toLowerCase()));

    return (
        <div className="container mx-auto p-4">
            <div className="sticky top-0 z-10 w-full p-4">
                <PokemonInput setSearchTerm={setSearchTerm} />
            </div>
            <div className="flex flex-col items-center">
                {filter.map((pokemon, index) => (
                    <PokemonRectangle key={index} pokemon={pokemon} />
                ))}
            </div>
        </div>
    );
}

export default TeamBuilder;

