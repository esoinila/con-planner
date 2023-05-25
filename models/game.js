const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const { DateTime } = require("luxon"); // no date object in this model

const GameSchema = new Schema({
    con: { type: Schema.Types.ObjectId, ref: "Con", required: true }, 
    title: { type: String, required: true },
    max_players: { type: Number, required: true },
    min_players: { type: Number, required: true },
    description: { type: String, required: true },
    // let's add start-time and end-time
    start_time: { type: Date, default: Date.now },
    end_time: { type: Date, default: Date.now },
    // let's add a list of players
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    num_bookings: { type: Number, default: 0 },
    is_full: { type: Boolean, default: false },
});

// Virtual for book's URL
GameSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/con/game/${this._id}`;
});


// Export model
module.exports = mongoose.model("Game", GameSchema);
