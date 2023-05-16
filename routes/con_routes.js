const express = require("express");
const router = express.Router();

// Require controller modules.
const game_controller = require("../controllers/gameController");
const booking_controller = require("../controllers/bookingController");

/// GAME ROUTES ///

// GET catalog home page.
router.get("/", game_controller.index);

// GET request for creating a Game. NOTE This must come before routes that display Game (uses id).
router.get("/game/create", game_controller.game_create_get);

// POST request for creating Game.
router.post("/game/create", game_controller.game_create_post);

// GET request to delete Game.
router.get("/game/:id/delete", game_controller.game_delete_get);

// POST request to delete Game.
router.post("/game/:id/delete", game_controller.game_delete_post);

// GET request to update Game.
router.get("/game/:id/update", game_controller.game_update_get);

// POST request to update Game.
router.post("/game/:id/update", game_controller.game_update_post);

// GET request for one GAme.
router.get("/game/:id", game_controller.game_detail);

// GET request for list of all Book items.
router.get("/games", game_controller.game_list);


/// BOOKING ROUTES ///

// GET request for creating a Booking. NOTE This must come before route that displays Booking (uses id).
router.get(
  "/booking/create",
  booking_controller.booking_create_get
);

// POST request for creating Booking.
router.post(
  "/booking/create",
  booking_controller.booking_create_post
);

// GET request to delete Booking.
router.get(
  "/booking/:id/delete",
  booking_controller.booking_delete_get
);

// POST request to delete Booking.
router.post(
  "/booking/:id/delete",
  booking_controller.booking_delete_post
);

// GET request to update Booking.
router.get(
  "/booking/:id/update",
  booking_controller.booking_update_get
);

// POST request to update Booking.
router.post(
  "/booking/:id/update",
  booking_controller.booking_update_post
);

// GET request for one Booking.
router.get("/booking/:id", booking_controller.booking_detail);

// GET request for list of all Bookings.
router.get("/bookings", booking_controller.booking_list);

module.exports = router;
