const Game = require("../models/game");
const Booking = require("../models/booking");
const Con = require("../models/con_model");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Summary of all games

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of games (in parallel)
  const [
    numCons,
    numGames,
    numBookings,
  ] = await Promise.all([
    Con.countDocuments({}).exec(),
    Game.countDocuments({}).exec(),
    Booking.countDocuments({}).exec(),

  ]);

  res.render("index", {
    title: "Getting Started",
    con_count: numCons,
    game_count: numGames,
    booking_count: numBookings,
  });
});


// Display list of all games.
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({})
    .sort({ con: 1, title: 1 })
    .populate("bookings")
    .exec();

  // Let's add the bookings for each game to bookings array

  const allCons = await Con.find({}).populate("games").exec();

  const allBookings = await Booking.find({}).populate("game").exec();

  // let's add all the bookings for each game
  allGames.forEach((game) => {
    allCons.forEach((con) => {
      if (con._id.toString() === game.con._id.toString()) {
        game.con = con;
      }
    });

    allBookings.forEach((booking) => {
      if (booking.game._id.toString() === game._id.toString()) {
        game.bookings.push(booking);
      }
    });
  });


  res.render("game_list", { title: "Game List", game_list: allGames, con_list: allCons });
});

// Display detail page for a specific game.
exports.game_detail = asyncHandler(async (req, res, next) => {
  // Get details of game
  const [game, gameInstances, cons] = await Promise.all([
    Game.findById(req.params.id).populate("bookings").exec(),
    Booking.find({ game: req.params.id }).exec(),
    Con.find({}).populate("games").exec(),
  ]);

  if (game === null) {
    // No results.
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game_detail", {
    title: "Game Detail",
    game: game,
    game_instances: gameInstances,
    cons: cons,
  });
});


// Display book create form on GET.
exports.game_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const allGames = await Game.find({})
    .sort({ title: 1 })
    .populate("bookings")
    .exec();

  const allCons = await Con.find({}).populate("games").exec();

  let con_list_is_empty = false;
  if (allCons.length === 0) {
    con_list_is_empty = true;
  }

  res.render("game_form", {
    page_title: "Create Game",
    games: allGames,
    con_list: allCons,
    con_list_is_empty: con_list_is_empty,
  });
});


// Handle book create on POST.
exports.game_create_post = [

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("min_players", "1-9 players")
    .trim()
    .isInt({ min: 1, max: 9 })
    .escape(),
  body("max_players", "1-9 players")
    .trim()
    .isInt({ min: 1, max: 9 })
    .escape(),
  body("description", "Description must not be under 80 characters.")
    .trim()
    .isLength({ min: 80 })
    .escape(),
  body("start_time", "Invalid start time")
    .optional({ checkFalsy: true })
    .toDate(),
  body("end_time", "Invalid end time")
    .optional({ checkFalsy: true })
    .toDate(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const game = new Game({
      con: req.body.con,
      title: req.body.title,
      max_players: req.body.max_players,
      min_players: req.body.min_players,
      description: req.body.description,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres, which we can use for adding to our book.
      const allGames = await Game.find({})
        .sort({ title: 1 })
        .exec();

      const allCons = await Con.find({}).populate("games").exec();

      let con_list_is_empty = false;
      if (allCons.length === 0) {
        con_list_is_empty = true;
      }

      res.render("game_form", {
        page_title: "Create Game",
        game: game,
        games: allGames,
        con_list: allCons,
        con_list_is_empty: con_list_is_empty,
        errors: errors.array(),
      });


    } else {
      // Data from form is valid. Save book.
      await game.save();
      res.redirect(game.url);
    }
  }),
];

// Display Author delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {

  const game = await Game.findById(req.params.id)
  
  const [matching_con, matching_bookings] = await Promise.all([
    Con.findById(game.con).exec(),
    Booking.find({con: game.con }).exec(),
  ]);

  game.con = matching_con;
  game.bookings = matching_bookings;

  if (game === null) {
    // No results.
    res.redirect("/con/games");
  }

  res.render("game_delete", {
    title: "Delete Game",
    game: game,
  });
});





exports.game_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game delete POST");
});

exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game update GET");
});

exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game update POST");
});

/*
// Display detail page for a specific book.



 
// Handle book create on POST.
exports.book_create_post = [
   // Convert the genre to an array.
   (req, res, next) => {
     if (!(req.body.genre instanceof Array)) {
       if (typeof req.body.genre === "undefined") req.body.genre = [];
       else req.body.genre = new Array(req.body.genre);
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
 
     // Create a Book object with escaped and trimmed data.
     const book = new Book({
       title: req.body.title,
       author: req.body.author,
       summary: req.body.summary,
       isbn: req.body.isbn,
       genre: req.body.genre,
     });
 
     if (!errors.isEmpty()) {
       // There are errors. Render form again with sanitized values/error messages.
 
       // Get all authors and genres for form.
       const [allAuthors, allGenres] = await Promise.all([
         Author.find().exec(),
         Genre.find().exec(),
       ]);
 
       // Mark our selected genres as checked.
       for (const genre of allGenres) {
         if (book.genre.indexOf(genre._id) > -1) {
           genre.checked = "true";
         }
       }
       res.render("book_form", {
         title: "Create Book",
         authors: allAuthors,
         genres: allGenres,
         book: book,
         errors: errors.array(),
       });
     } else {
       // Data from form is valid. Save book.
       await book.save();
       res.redirect(book.url);
     }
   }),
 ];
 
// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
 res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
 res.send("NOT IMPLEMENTED: Book delete POST");
});

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