#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Booking = require("./models/booking");

const games = [];
const bookings = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGames();
    await createBookings();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function gameCreate(title, max_players, min_players, description, start_time, end_time) {
    gamedetail = {
        title: title,
        max_players: max_players,
        min_players: min_players,
        description: description,
        start_time: start_time,
        end_time: end_time,
    };

    const game = new Game(gamedetail);
    await game.save();
    games.push(game);
    console.log(`Added game: ${title}`);
}

async function bookingCreate(game, playername, date) {
    bookingdetail = {
        game: game,
        playername: playername,
        date: date,
    };

    const booking = new Booking(bookingdetail);
    await booking.save();
    bookings.push(booking);
    console.log(`Added booking: ${playername} for ${game.title}`);
}


async function createGames() {
    console.log("Adding Books");
    await Promise.all([
        gameCreate(
            "Arius, Karanneet Abbedissan aarteet",
            5,
            3,
            "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
            Date.now() + 1000 * 60 * 60 * 1,
            Date.now() + 1000 * 60 * 60 * 2.1
        ),
        gameCreate(
            "Ponipeli, Kaverimerkkejä haussa sekä paljon glitteriä ja kikatusta",
            5,
            3,
            "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
            Date.now() + 1000 * 60 * 60 * 1,
            Date.now() + 1000 * 60 * 60 * 2
        ),
        gameCreate(
            "Sotakarjut sotakarjut ja kaikilla sokka irti ja teräs-sorkat jaloissa",
            7,
            2,
            "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
            Date.now() + 1000 * 60 * 60 * 1,
            Date.now() + 1000 * 60 * 60 * .5
        ),
        gameCreate(
            "Columbo sanoo viimeisen sanan ja ratkaisee tapauksen",
            6,
            3,
            "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
            Date.now() + 1000 * 60 * 60 * 1,
            Date.now() + 1000 * 60 * 60 * 1.5
        ),
        gameCreate(
            "Silkkaa fiascoa, yhtä hahmoa taas koetetaan murhata monin tavoin",
            6,
            3,
            "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
            Date.now() + 1000 * 60 * 60 * 1,
            Date.now() + 1000 * 60 * 60 * 2
        ),

    ]);
}

async function createBookings() {
    console.log("Adding authors");
    await Promise.all([
        bookingCreate(games[0], "Matti Meikäläinen", Date.now() + 1000 * 60 * 60 * 1),
        bookingCreate(games[1], "Maija Meikäläinen", Date.now() + 1000 * 60 * 60 * 1.1),
        bookingCreate(games[2], "Laura Punapää", Date.now() + 1000 * 60 * 60 * 1.2),
        bookingCreate(games[3], "Matias Arkeologi", Date.now() + 1000 * 60 * 60 * 1.3),
        bookingCreate(games[4], "Joonas Protagonisti", Date.now() + 1000 * 60 * 60 * 1.4),

        bookingCreate(games[0], "Merja Nykänen", Date.now() + 1000 * 60 * 60 * 0.9),
        bookingCreate(games[1], "Milla Bikineissä", Date.now() + 1000 * 60 * 60 * 0.81),
        bookingCreate(games[2], "Törstig Lageröl", Date.now() + 1000 * 60 * 60 * 0.42),
        bookingCreate(games[2], "Ken Heine", Date.now() + 1000 * 60 * 60 * 0.43),
        bookingCreate(games[3], "Neiti Pelottava", Date.now() + 1000 * 60 * 60 * 1.22),
        bookingCreate(games[3], "Joku Sari", Date.now() + 1000 * 60 * 60 * 1.14),

    ]);
}