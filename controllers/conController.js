const Con = require("../models/con_model");
const Booking = require("../models/booking");
const Game = require("../models/game");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");



// LANDING PAGE
exports.index = asyncHandler(async (req, res, next) => {
  // Get details of games (in parallel)
  const [
    numCons,
    numGames,
    numBookings,
    allCons,
  ] = await Promise.all([
    Con.countDocuments({}).exec(),
    Game.countDocuments({}).exec(),
    Booking.countDocuments({}).exec(),
    Con.find({})
      .sort({ title: 1 })
      .populate("games")
      .exec(),
  ]);

  res.render("index", {
    title: "Using Con-planner in five steps",
    con_count: numCons,
    game_count: numGames,
    con_list: allCons,
    booking_count: numBookings,

  });
});


// CON LIST.
exports.con_list = asyncHandler(async (req, res, next) => {
  const allCons = await Con.find({})
    .sort({ title: 1 })
    .populate("games")
    .exec();

  const allGames = await Game.find({})
    .sort({ title: 1 })
    .populate("bookings")
    .exec();

  // let's add all the games for each con
  allCons.forEach((con) => {
    allGames.forEach((game) => {
      if (game.con._id.toString() === con._id.toString()) {
        con.games.push(game);
      }
    });
  });

  // Let's add the bookings for each game to bookings array
  const allBookings = await Booking.find({}).populate("game").exec();

  // let's add all the bookings for each game
  allGames.forEach((game) => {
    allBookings.forEach((booking) => {
      if (booking.game._id.toString() === game._id.toString()) {
        game.bookings.push(booking);
      }
    });
  });

  res.render("con_index", { title: "Con List", game_list: allGames, con_list: allCons });
});


// Display detail page for a specific con.
exports.con_detail = asyncHandler(async (req, res, next) => {

  // Utility to convert HH:MM to milliseconds
  const HHMMtoMilliseconds = (hm) => {
    var a = hm.split(':');
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60;
    return seconds * 1000;
  }


  // Get details of game
  const [con, games, bookings] = await Promise.all([
    Con.findById(req.params.id).populate("games").exec(),
    Game.find({ con: req.params.id }).sort({ con: 1, title: 1 })
      .populate("con").populate("bookings").exec(),
    Booking.find({ con: req.params.id }).populate("game").exec(),
  ]);

  const startingTimes = [];

  games.forEach((game) => {
    bookings.forEach((booking) => {
      if (booking.game._id.toString() === game._id.toString()) {
        game.bookings.push(booking);
        startingTimes.push(game.start_time);
        //console.log("game.start_time: " + game.start_time);
        //console.log("HHMMtoMilliseconds(game.start_time): " + HHMMtoMilliseconds(game.start_time));
      }
    });
  });

  if (con === null) {
    // No results.
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("new_con_detail", {
    title: con.title,
    con: con,
    games: games,
    bookings: bookings,
  });
});


// Display con create form on GET.
exports.con_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const allCons = await Con.find({})
    .sort({ title: 1 })
    .populate("games")
    .exec();

  res.render("con_form", {
    page_title: "Create Con",
    games: allCons,
  });
});


// Handle con create on POST.
exports.con_create_post = [

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("description", "Description must not be under 30 characters.")
    .trim()
    .isLength({ min: 30 })
    .escape(),
  body("date", "Invalid date")
    .optional({ checkFalsy: true })
    .toDate(),
  body("time", "Invalid time") // validate 24h format here
    .trim()
  //.matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
  ,
  body("deletepassword", "problem with your password")
    .trim()
    .escape(),



  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const con = new Con({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      deletepassword: req.body.deletepassword,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      const allCons = await Con.find({})
        .sort({ title: 1 })
        .populate("games")
        .exec();

      res.render("con_form", {
        page_title: "Create Con",
        con: con,
        cons: allCons,
        errors: errors.array(),
      });

    } else {
      // Data from form is valid. Save book.
      await con.save();
      res.redirect(con.url);
    }
  }),
];


// Display Con delete form on GET.
exports.con_delete_get = asyncHandler(async (req, res, next) => {

  const con = await Con.findById(req.params.id)

  const [matching_games, matching_bookings] = await Promise.all([
    Game.find({ con: req.params.id }).populate("bookings").exec(),
    Booking.find({ con: req.params.id }).populate("game").populate("con").exec(),
  ]);

  con.games = matching_games;
  con.bookings = matching_bookings;

  if (con === null) {
    // No results.
    res.redirect("/con/cons");
  }

  res.render("con_delete", {
    title: "Delete Con",
    con: con,
  });
});


// Handle Con delete on POST.
exports.con_delete_post = [
  body("deletepassword", "problem with your password")
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Get details of game 
    const con = await Con.findById(req.body.conid).populate("bookings").exec();

    const matching_bookings = await Booking.find({ con: req.body.conid })
      .populate("con")
      .exec();

    const matching_games = await Game.find({ con: req.body.conid })
      .populate("con")
      .exec();

    if (req.body.deletepassword != con.deletepassword) {
      let errors = [];
      const err_str = "Password " + req.body.deletepassword + " does not match your deletepassword.";
      errors.push({ msg: err_str });

      res.render("con_delete", {
        title: "Delete Con",
        con: con,
        errors: errors,
      });
      return;
    }



    if (con === null) {
      // Booking not found
      res.render("con_delete", {
        title: "Delete Con",
        game: game,
      });
      return;
    } else {

      // Delete all bookings associated with this game
      if (matching_bookings.length > 0) {
        await Booking.deleteMany({ con: req.body.conid }).exec();
      }

      // Delete all games associated with this game
      if (matching_games.length > 0) {
        await Game.deleteMany({ con: req.body.conid }).exec();
      }

      // Delete object and redirect to the list of bookings.
      await Con.findByIdAndRemove(req.body.conid);
      res.redirect("/con/cons");
    }
  })
]



exports.con_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create POST");
});

exports.con_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create POST");
});

/*
// Display detail page for a specific book.
 
// Handle book create on POST.

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
 // Get book, authors and genres for form.
 const [book, allAuthors, allGenres] = await Promise.all([
   Book.findById(req.params.id).populate("author").populate("genre").exec(),
   Author.find().exec(),
   Genre.find().exec(),
 ]);

 if (book === null) {
   // No results.
   const err = new Error("Book not found");
   err.status = 404;
   return next(err);
 }

 // Mark our selected genres as checked.
 for (const genre of allGenres) {
   for (const book_g of book.genre) {
     if (genre._id.toString() === book_g._id.toString()) {
       genre.checked = "true";
     }
   }
 }

 res.render("book_form", {
   title: "Update Book",
   authors: allAuthors,
   genres: allGenres,
   book: book,
 });
});


// Handle book update on POST.
exports.book_update_post = [
 // Convert the genre to an array.
 (req, res, next) => {
   if (!(req.body.genre instanceof Array)) {
     if (typeof req.body.genre === "undefined") {
       req.body.genre = [];
     } else {
       req.body.genre = new Array(req.body.genre);
     }
   }
   next();
 },

 // Validate and sanitize fields.
 body("title", "Title must not be empty.")
   .trim()
   .isLength({ min: 1 })
   .escape(),
 body("author", "Author must not be empty.")
   .trim()
   .isLength({ min: 1 })
   .escape(),
 body("summary", "Summary must not be empty.")
   .trim()
   .isLength({ min: 1 })
   .escape(),
 body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
 body("genre.*").escape(),

 // Process request after validation and sanitization.
 asyncHandler(async (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   // Create a Book object with escaped/trimmed data and old id.
   const book = new Book({
     title: req.body.title,
     author: req.body.author,
     summary: req.body.summary,
     isbn: req.body.isbn,
     genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
     _id: req.params.id, // This is required, or a new ID will be assigned!
   });

   if (!errors.isEmpty()) {
     // There are errors. Render form again with sanitized values/error messages.

     // Get all authors and genres for form
     const [allAuthors, allGenres] = await Promise.all([
       Author.find().exec(),
       Genre.find().exec(),
     ]);

     // Mark our selected genres as checked.
     for (const genre of allGenres) {
       if (book.genre.indexOf(genres._id) > -1) {
         genre.checked = "true";
       }
     }
     res.render("book_form", {
       title: "Update Book",
       authors: allAuthors,
       genres: allGenres,
       book: book,
       errors: errors.array(),
     });
     return;
   } else {
     // Data from form is valid. Update the record.
     const thebook = await Book.findByIdAndUpdate(req.params.id, book, {});
     // Redirect to book detail page.
     res.redirect(thebook.url);
   }
 }),
];
*/