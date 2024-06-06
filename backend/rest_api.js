import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from "./database_service.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Request method: ${req.method}, URL: ${req.url}`);
    next();
});

app.get('/pokemons', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;

    db.all("SELECT * FROM pokemon LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(rows);
    });
});

// TODO: change to send all at once wehen done building Team builder
app.get('/pokemons/batch', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = 10;

    db.all("SELECT * FROM pokemon LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(rows);
    });
});


app.get('/pokemon/:name', (req, res) => {
    const { name } = req.params;
    db.get("SELECT * FROM pokemon WHERE name_en = ?", [name], (err, row) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        if (row) res.json(row);

        else res.status(404).send('Pokemon not found');
    });
});

app.get('/pokemon/forms/:id', (req, res) => {
    const { id } = req.params;
    db.all("SELECT * FROM pokemon_forms WHERE original_pokemon_id = ?", [id], (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        if (rows.length > 0) res.json(rows);
        else res.status(404).send('No forms found for this Pokémon');
    });
});


app.get('/moves', (req, res) => {
    let query = "SELECT * FROM move";
    const params = [];
    if (req.query.names) {
        const names = req.query.names.split(',');
        query += " WHERE name IN (" + new Array(names.length).fill('?').join(',') + ")";
        params.push(...names);
    }
    if (req.query.limit) {
        query += " LIMIT ?";
        params.push(parseInt(req.query.limit));
    }
    if (req.query.offset) {
        query += " OFFSET ?";
        params.push(parseInt(req.query.offset));
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.get('/extra', (req, res) => {
    db.all("SELECT * FROM extra", (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(rows);
    });
});



export default app;