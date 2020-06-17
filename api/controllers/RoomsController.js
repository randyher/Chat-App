/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: (req, res) => {
    Room.find({}).exec((err, rooms) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      res.view("rooms/index", { rooms });
    });
  },

  new: (req, res) => {
    Room.find({}).exec((err, articles) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      res.view("rooms/new", { articles });
    });
  },
};
