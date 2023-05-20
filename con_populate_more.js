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
    await findGame("Arius, Karanneet Abbedissan aarteet");
    if(games.length > 0) {
        await createBookings();    
    } else {
        console.error("No games found, skipping rest of script");
    }
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function findGame(title) {
    const game = await Game.findOne({ title: title });
    if(game) {
        console.log(`Found game: ${title}`);
        games.push(game);
    } else {
        console.error(`Game not found: ${title}`);
    }
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



async function createBookings() {
    console.log("Adding authors");
    await Promise.all([
        bookingCreate(games[0], "Jozzy", Date.now() + 1000 * 60 * 60 * 1.11),
        bookingCreate(games[0], "Finnacle", Date.now() + 1000 * 60 * 60 * 1.10),

    ]);
}