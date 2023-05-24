const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // let's add start-time and end-time
    date: { type: Date, required: true },

    time: { type: String, required: true },
    // let's add a list of players
    games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
    num_games: { type: Number, default: 0 },
    was_already: { type: Boolean, default: false }
});

// Virtual for book's URL
ConSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/con/con/${this._id}`;
});

// Export model
module.exports = mongoose.model("Con", ConSchema);
