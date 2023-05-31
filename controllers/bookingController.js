const Booking = require("../models/booking");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Game = require("../models/game");
const Con = require("../models/con_model");

// Display list of all Bookings.
exports.booking_list = asyncHandler(async (req, res, next) => {
  const allBookings = await Booking.find().populate("game").exec();

  res.render("booking_list", {
    title: "Booking List",
    booking_list: allBookings,
  });
});


exports.booking_detail = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate("game").exec();

  const [matching_con, matching_game] = await Promise.all([
    Con.findById(booking.con).exec(),
    Game.findById(booking.game).exec(),
  ]);

  booking.con = matching_con;
  booking.game = matching_game;

  if (booking === null) {
    // No results.
    const err = new Error("Booking copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("booking_detail", {
    title: "Booking:",
    booking: booking,
  });
});


// Display BookInstance create form on GET.
exports.booking_create_get = asyncHandler(async (req, res, next) => {

  const allGames = await Game.find({})
    .sort({ title: 1 })
    .populate("bookings")
    .exec();

  // Let's add the bookings for each game to bookings array

  const allBookings = await Booking.find({}).populate("game").exec();

  // let's add all the bookings for each game
  allGames.forEach((game) => {
    allBookings.forEach((booking) => {
      if (booking.game._id.toString() === game._id.toString()) {
        game.bookings.push(booking);
      }
    });
    game.num_bookings = game.bookings.length;
    game.is_full = game.num_bookings >= game.max_players;
  });
  const fullGames = allGames.filter(game => game.is_full === true);
  const gamesWithSpace = allGames.filter(game => game.is_full === false);

  res.render("booking_form", {
    title: "Create Booking",
    game_list_full: fullGames,
    game_list_space: gamesWithSpace
  });

});


exports.booking_create_post = [

  body("game", "Game must be specified").trim().isLength({ min: 5 }).escape(),
  body("playername", "Player name must be specified and be longer that 3 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("date", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("deletepassword", "problem with your password")
    .trim()
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    // new mongoose.Types.ObjectId(req.body.game)
    const games = await Game.find({ "_id": req.body.game })
      .sort({ title: 1 })
      .populate("bookings")
      .exec();

    const allBookings = await Booking.find({ "game": req.body.game })
      .populate("game").exec();

    // Find the game so we can read the con
    const game = await Game.findById(req.body.game)
      .populate("con")
      .exec();


    const booking = new Booking({
      game: req.body.game,
      playername: req.body.playername,
      deletepassword: req.body.deletepassword,
      date: req.body.date,
      con: game.con
    });


    games.forEach((game) => {
      allBookings.forEach((booking) => {
        if (booking.game._id.toString() === game._id.toString()) {
          game.bookings.push(booking);
        }
      });
      game.num_bookings = game.bookings.length;
      game.is_full = game.num_bookings >= game.max_players;
    });

    if (!errors.isEmpty() || games.length === 0 || games[0].is_full) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allGames = await Game.find({})
        .sort({ title: 1 })
        .populate("bookings")
        .exec();

      // Let's add the bookings for each game to bookings array

      const allBookings = await Booking.find({}).populate("game").exec();

      // let's add all the bookings for each game
      allGames.forEach((game) => {
        allBookings.forEach((booking) => {
          if (booking.game._id.toString() === game._id.toString()) {
            game.bookings.push(booking);
          }
        });
        game.num_bookings = game.bookings.length;
        game.is_full = game.num_bookings >= game.max_players;
      });
      const fullGames = allGames.filter(game => game.is_full === true);
      const gamesWithSpace = allGames.filter(game => game.is_full === false);

      res.render("booking_form", {
        title: "Create Booking",
        game_list_full: fullGames,
        game_list_space: gamesWithSpace,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      await booking.save();
      res.redirect(booking.url);
    }
  }),
];

// Display Author delete form on GET.
exports.booking_delete_get = asyncHandler(async (req, res, next) => {

  const booking = await Booking.findById(req.params.id)

  const [matching_con, matching_game] = await Promise.all([
    Con.findById(booking.con).exec(),
    Game.findById(booking.game).exec(),
  ]);

  booking.con = matching_con;
  booking.game = matching_game;

  if (booking === null) {
    // No results.
    res.redirect("/con/bookings");
  }

  res.render("booking_delete", {
    title: "Delete Booking",
    booking: booking,
  });
});


exports.booking_delete_post = [
  body("deletepassword", "problem with your password")
  .trim()
  .escape(),  
  // Handle Author delete on POST.
  asyncHandler(async (req, res, next) => {
    // Get details of booking 
    const [booking] = await Promise.all([
      Booking.findById(req.body.bookingid).exec(),
    ]);

    if (req.body.deletepassword != booking.deletepassword) {
      let errors = [];
      const err_str = "Password " + req.body.deletepassword + " does not match your deletepassword.";
      errors.push({ msg: err_str });

      res.render("booking_delete", {
        title: "Delete Booking",
        booking: booking,
        errors: errors,
      });
      return;
    }

    if (booking === null) {
      // Booking not found
      res.render("booking_delete", {
        title: "Delete Booking",
        booking: booking,
      });
      return;
    } else {
      // Delete object and redirect to the list of bookings.
      await Booking.findByIdAndRemove(req.body.bookingid);
      res.redirect("/con/bookings");
    }
  })
];


exports.booking_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Booking update GET");
});

exports.booking_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Booking update POST");
});


