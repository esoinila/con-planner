const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const BookingSchema = new Schema({
  con: { type: Schema.Types.ObjectId, ref: "Con", required: true }, 
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true }, // reference to the associated game
  playername: { type: String, required: true },
  deletepassword: { type: String, default: "" },
  date: { type: Date, default: Date.now }
});

// Virtual for bookinstance's URL
BookingSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/con/booking/${this._id}`;
});

BookingSchema.virtual("date_formatted").get(function () {
  
  
  let string = DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
  
  return string;
});


// Export model
module.exports = mongoose.model("Booking", BookingSchema);
