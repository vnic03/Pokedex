import React, { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import InfiniteScroll from "react-infinite-scroll-component";


function PokemonList({ onPokemonClick }) {
    const limit = 20;

    const [pokemons, setPokemons] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreData = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:3000/pokemons?offset=${offset}&limit=${limit}`
            );
            const data = await response.json();

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setPokemons(prevPokemons => {
                    const newPokemons = data.filter(
                        pokemon => !prevPokemons.some(p => p.id === pokemon.id)
                    );
                    return [...prevPokemons, ...newPokemons];
                });
                setOffset(offset + limit);
            }

            if (data.length < limit) {
                setHasMore(false);
            }
        } catch (e) {
            console.log('Error: ', e);
            setHasMore(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadMoreData();
    }, []);

    return (
        <InfiniteScroll
            next={loadMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            dataLength={pokemons.length}
            endMessage={
                <div className="text-center p-4 text-lg">
                    <b>Yay! You have seen it all</b>
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {pokemons.map(pokemon => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={onPokemonClick} />
                ))}
            </div>
        </InfiniteScroll>
    );
}

export default PokemonList;
