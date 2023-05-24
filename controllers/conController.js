const Con = require("../models/con_model");
const Booking = require("../models/booking");
const Game = require("../models/game");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");



// Summary of all cons
exports.index = asyncHandler(async (req, res, next) => {
    // Get details of games (in parallel)
    const [
        numCons,
        numGames,
    ] = await Promise.all([
        Con.countDocuments({}).exec(),
        Game.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Cafe Cons",
        con_count: numCons,
        game_count: numGames,
    });
});

// Display list of all cons and their games.
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




// Display detail page for a specific game.
exports.con_detail = asyncHandler(async (req, res, next) => {
    // Get details of game
    const [con, games] = await Promise.all([
        Con.findById(req.params.id).populate("bookings").exec(),
        Game.find({ game: req.params.id }).exec(),
    ]);

    if (con === null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
    }

    res.render("con_detail", {
        title: con.title,
        con: con,
        games: games,
    });
});


// Display book create form on GET.
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
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            const allCons = await Con.find({})
                .sort({ title: 1 })
                .populate("games")
                .exec();

            res.render("con_form", {
                page_title: "Create Con",
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



exports.con_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Game create POST");
});

exports.con_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Game create POST");
});

exports.con_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Game create POST");
});

exports.con_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Game create POST");
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