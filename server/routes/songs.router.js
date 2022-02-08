const express = require('express');
const router = express.Router();
const pg = require('pg');

const Pool = pg.Pool;

// pool is how you talk to the database
const pool = new Pool({
    database: 'music-library', //the name of the database
    host: 'localhost', // where our database is
    port: 5432, // the port for your database - always using this port num with PG - its a default port for postgres
    max: 10, // how many connections or queries we can have at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect, then cancel query
});

// is not required but is useful for debugging
pool.on('connect', () => {
    console.log('postgreSQL is connected');
    
})

// the pool wil emit an error on behalf of any idle clients
pool.on('error', (error) => {
    console.log('error with postgres pool', error);
    
});

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    // res.send(songs);
    // check jquery text in postico first!
    let queryText = 'SELECT * FROM "songs";';
    pool.query(queryText)
    .then ((result) => {
        res.send(result.rows);
    })
    .catch((err) => {
        console.log('error making query', queryText, err);
        res.sendStatus(500);
    })
    
});
router.post('/', (req, res) => {
    songs.push(req.body);
    res.sendStatus(200);
});

module.exports = router;