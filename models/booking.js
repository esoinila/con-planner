const mongoose = require("mongoose");
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true }, // reference to the associated game
  playername: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Virtual for bookinstance's URL
BookingSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/con/booking/${this._id}`;
});

BookingSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date.toLocaleString(DateTime.DATE_MED));
});


// Export model
module.exports = mongoose.model("Booking", BookingSchema);
