/**
 * MessagesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// const Message = require("../models/Message");

module.exports = {
  create: async (req, res) => {
    if (!req.session.userId) {
      res.redirect("/");
    }

    const { id } = req.params;
    const { message } = req.body;

    const newMessage = await Message.create({
      text: message,
      room: id,
      user: req.session.userId,
    });
    const user = User.findOne({ id: req.session.userId }).exec((err, user) => {
      res.redirect(`/rooms/${id}`);
      // return res.ok();
    });
  },
};
