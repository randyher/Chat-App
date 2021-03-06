/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var Filter = require("bad-words");

module.exports = {
  index: (req, res) => {
    if (!req.body && !req.session.userId) {
      res.redirect("/");
    } else if (req.body) {
      const { username } = req.body;
      filter = new Filter();
      if (filter.isProfane(username)) {
        res.send(500, {
          error: "Username is using profanity; go back and try again",
        });
      }
      User.findOrCreate({ username }, { username }).exec((err, user) => {
        if (err) {
          res.send(500, { error: "Could not find user" });
        }
        req.session.userId = user.id;
        Room.find({}).exec((err, rooms) => {
          if (err) {
            res.send(500, { error: "Could not find chatrooms" });
          }

          res.view("rooms/index", { rooms, user });
        });
      });
    } else if (req.session.userId) {
      User.findOne({ id: req.session.userId }).exec((err, user) => {
        req.session.userId = user.id;
        if (err) {
          res.send(500, { error: "No User Found" });
        }
        Room.find({}).exec((err, rooms) => {
          if (err) {
            res.send(500, { error: "Database Error" });
          }

          res.view("rooms/index", { rooms, user });
        });
      });
    }
  },

  new: (req, res) => {
    res.view("rooms/new");
  },

  create: (req, res) => {
    const newRoom = { topic: req.body.topic };
    Room.create(newRoom).exec((err) => {
      if (err) {
        res.send(500, {
          error: "Room name must be unique; go back and try again!",
        });
      }
      res.redirect("/rooms");
    });
  },

  show: async (req, res) => {
    const { id } = req.params;
    if (!req.session.userId) {
      res.redirect("/");
    }

    const currentUser = await User.findOne({ id: req.session.userId });

    Room.findOne({ id }).exec((err, room) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      if (!room) {
        res.redirect("/rooms");
      }

      Message.find({ room: room.id })
        .populate("user")
        .exec((err, messages) => {
          res.view("rooms/show", { room, messages, currentUser });
        });
    });
  },
};
