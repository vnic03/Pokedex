
class Pokemon {

    constructor({
                    id, name_en, name_other, pokedex_id, types, gender_ratio, sprites, cry,
                    abilities, base_stats, moves, evolutions, weight, height, category, color,
                    generation, egg_groups, pokemon_descriptions, legendary_or_mythical
                })
    {
        this.id = id;
        this.name_en = name_en;
        this.name_other = name_other;
        this.pokedex_id = pokedex_id;
        this.types = types;
        this.gender_ratio = gender_ratio;
        this.sprites = sprites;
        this.cry = cry;
        this.abilities = abilities;
        this.base_stats = base_stats;
        this.moves = moves;
        this.evolutions = evolutions;
        this.weight = weight;
        this.height = height;
        this.category = category;
        this.color = color;
        this.generation = generation;
        this.egg_groups = egg_groups;
        this.pokemon_descriptions = pokemon_descriptions;
        this.legendary_or_mythical = legendary_or_mythical;
    }
}

export default Pokemon;
