const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: { type: String, required: true },
    max_players: { type: Number, required: true },
    min_players: { type: Number, required: true },
    description: { type: String, required: true },
    // let's add start-time and end-time
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    // let's add a list of players
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }]
});

// Virtual for book's URL
GameSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/con/game/${this._id}`;
});

// Export model
module.exports = mongoose.model("Game", GameSchema);
