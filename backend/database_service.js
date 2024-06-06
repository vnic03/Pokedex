import sqlite3 from 'sqlite3';

// TODO: delete unnecessary methods when done

import fetchPokemon, {fetchPokemonForm} from "./src/api/pokeapi.js";
// import fetchMove from "./src/api/moveapi.js";
// import fetchItem from "./src/api/itemapi.js";
// import fs from "fs";


const db = new sqlite3.Database('./pokemon.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to the Pokemon database:', err.message);
        return;
    }
    console.log('Connected with the Pokemon database');
    initializeDatabase();
});

function initializeDatabase() {
    db.run(pokemon_table,  err => {
        if (err) {
            console.error('Error creating table', err.message);
            db.close();
        } else {
            createMovesTable();
        }
    });
}

const createMovesTable = () => {
    db.run(moves_table, err => {
        if (err) console.error('Error creating Moves table', err.message);
        else createFormsTable();
    });
};

const createFormsTable = () => {
    db.run(forms_table, err => {
        if (err) console.error('Error creating Forms table', err.message);
        else createItemTable();
    });
};

const createItemTable = () => {
    db.run(item_table, err => {
        if (err) console.error('Error creating Item table', err.message);
        else createExtraTable();
    });
}

const createExtraTable = () => {
    db.run(extra_table, err => {
        if (err) console.error('Error creating Extra table', err.message);
        else {
            // insertPokemonFormsData();
            // insertPokemonData();
        }
    });
}

async function insertPokemonData() {
    for (let id = 387; id <= 649; id++) { // bis gen V gerade
        try {
            const pokemon = await fetchPokemon(id);

            let descriptions = {};
            if (pokemon.pokemon_descriptions && typeof pokemon.pokemon_descriptions === 'object') {
                descriptions = Object.fromEntries(pokemon.pokemon_descriptions);
            }

            const insert = `INSERT INTO pokemon (
                id, name_en, name_other, pokedex_id, types, gender_ratio, sprites, cry, 
                abilities, base_stats, moves, evolutions, weight, height, 
                category, color, generation, egg_groups, descriptions, legendary_or_mythical
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.run(insert, [
                pokemon.id, pokemon.name_en, pokemon.name_other.join("; "), pokemon.pokedex_id,
                pokemon.types.join("; "), pokemon.gender_ratio, JSON.stringify(pokemon.sprites),
                pokemon.cry, JSON.stringify(pokemon.abilities), JSON.stringify(pokemon.base_stats),
                pokemon.moves.join("; "), JSON.stringify(pokemon.evolutions), pokemon.weight, pokemon.height,
                pokemon.category, pokemon.color, pokemon.generation, pokemon.egg_groups.join("; "),
                JSON.stringify(descriptions), pokemon.legendary_or_mythical
            ], err => {
                if (err) {
                    console.error(`Error inserting data for Pokemon ID ${id}:`, err.message);
                } else {
                    console.log(`Pokemon data inserted successfully for ID ${id}`);
                }
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (err) {
            console.error(`Error fetching Pokemon with ID ${id}:`, err);
        }
    }
}

async function insertPokemonFormsData() {
    for (let id = 10001; id <= 10277; id++) {
        try {
            const pokemonForm = await fetchPokemonForm(id);
            if (!pokemonForm) {
                console.log(`No data returned for form ID ${id}. Skipping.`);
                continue;
            }

            const exists = await checkOriginalPokemonExists(pokemonForm.original_pokemon_id);
            if (!exists) {
                console.log(`Original Pokemon ID ${pokemonForm.original_pokemon_id} not found. Skipping.`);
                continue;
            }

            const duplicateExists = await checkFormDuplicate(id);
            if (duplicateExists) {
                console.log(`Form ID ${id} already exists in the database. Skipping.`);
                continue;
            }

            const insert = `INSERT INTO pokemon_forms (
                id, name_en, types, sprites, original_pokemon_id
            ) VALUES (?, ?, ?, ?, ?)`;

            db.run(insert, [
                pokemonForm.id, pokemonForm.name_en,
                pokemonForm.types.join("; "),
                pokemonForm.sprites,
                pokemonForm.original_pokemon_id
            ], err => {
                if (err) console.error(`Error inserting data for Pokemon form ID ${id}:`, err.message);
                else console.log(`Pokemon form data inserted successfully for ID ${id}`);
            });
        } catch (err) {
            console.error(`Error processing Pokemon form with ID ${id}:`, err);
        }
    }
}


async function checkOriginalPokemonExists(originalPokemonId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM pokemon WHERE id = ?`, [originalPokemonId], (err, row) => {
            if (err) {
                console.error('Error checking if original pokemon exists:', err.message);
                return reject(err);
            }
            resolve(!!row);
        });
    });
}

async function checkFormDuplicate(formId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM pokemon_forms WHERE id = ?`, [formId], (err, row) => {
            if (err) {
                console.error('Error checking for duplicate form ID:', err.message);
                return reject(err);
            }
            resolve(!!row);
        });
    });
}

/*
async function insertItemData() {
    const names = JSON.parse(fs.readFileSync('items.json', 'utf-8'));

    for (const name of names) {
        try {
            const item = await fetchItem(name);
            if (item) {
                const insert = `INSERT INTO item (id, name, sprite, description) VALUES (?, ?, ?, ?)`;

                db.run(insert, [item.id, item.name, item.sprite, item.description], (err) => {

                    if (err) console.error(`Error inserting item with name ${name}:`, err.message);
                    else console.log(`Item data inserted successfully for ${name}`);
                });
            }
        } catch (e) {
            console.error(`Error processing item with name ${name}:`, e);
        }
    }
}

async function insertMoveData() {
    let moves = [];
    const max = 919;
    const batch = 50;

    for (let id = 2; id <= max; id += batch) {
        const fetchPromises = [];
        for (let j = id; j < id + batch && j <= max; j++) {
            fetchPromises.push(fetchMove(j).catch(e => {
                console.error(`Error fetching Move ID ${j}:`, e.message);
                return null;
            }));
        }

        const results = await Promise.all(fetchPromises);
        moves = results.filter(move => move !== null);

        const placeholders = moves.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
        const insertValues = [];
        moves.forEach(move => {
            insertValues.push(move.id, move.name, move.power, move.accuracy, move.pp,
                move.type, move.category, move.short_effect, move.effect,
                move.priority, move.target);
        });

        if (insertValues.length > 0) {
            const insertSql = `INSERT INTO move (
                id, name, power, accuracy, pp, type, category, short_effect, effect, priority, target
            ) VALUES ${placeholders}`;

            db.run(insertSql, insertValues, (err) => {
                if (err) console.error('Error inserting moves:', err.message);
                else console.log(`Moves from ID ${id} to ${id + batch - 1} inserted successfully`);
            });
        }
    }
}
 */

const pokemon_table = `
CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,
    name_en TEXT,
    name_other TEXT,
    pokedex_id INTEGER,
    types TEXT,
    gender_ratio TEXT,
    sprites TEXT,
    cry TEXT,
    abilities TEXT,
    base_stats TEXT,
    moves TEXT,
    evolutions TEXT,
    weight INTEGER,
    height INTEGER,
    category TEXT,
    color TEXT,
    generation TEXT,
    egg_groups TEXT,
    descriptions TEXT,
    legendary_or_mythical TEXT
);`;

const forms_table = `
CREATE TABLE IF NOT EXISTS pokemon_forms (
    id INTEGER PRIMARY KEY,
    name_en TEXT,
    types TEXT,
    sprites TEXT,
    original_pokemon_id INTEGER,
    FOREIGN KEY (original_pokemon_id) REFERENCES pokemon(id)
);`;

const moves_table = `
CREATE TABLE IF NOT EXISTS move (
    id INTEGER PRIMARY KEY,
    name TEXT,
    power INTEGER,
    accuracy INTEGER,
    pp INTEGER,
    type TEXT,
    category TEXT,
    short_effect TEXT,
    effect TEXT,
    priority INTEGER,
    target TEXT
);`;

const item_table = `
CREATE TABLE IF NOT EXISTS item (
    id INTEGER PRIMARY KEY,
    name TEXT,
    sprite TEXT,
    description TEXT
);`;


const extra_table = `
CREATE TABLE IF NOT EXISTS extra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    types TEXT,
    attack_type TEXT
);`;


function findMove(id) {
    const t = `SELECT * FROM move WHERE id = ?`;
    db.get(t, [id], (err, row) => {
        if (err) {
            console.error(`Error fetching Move with ID ${id}:`, err.message);
            return;
        }
        if (row) {
            console.log(`Found Move with ID ${id}:`);
            console.log(JSON.stringify(row, null, 2));
        } else {
            console.log(`No Move found with ID ${id}.`);
        }
    });
}

// findMove(920);

function findPokemon(pokemonId) {
    const query = `SELECT * FROM pokemon WHERE id = ?`;
    db.get(query, [pokemonId], (err, row) => {
        if (err) {
            console.error(`Error fetching Pokemon with ID ${pokemonId}:`, err.message);
            return;
        }
        if (row) {
            console.log(`Found Pokemon with ID ${pokemonId}:`);
            console.log(row);

        } else console.log(`No Pokemon found with ID ${pokemonId}`);
    });
}

// findPokemon(25);


export default db;