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
    const { username, text } = req.body;
    console.log(username, text);

    User.findOne({ username }).exec(async (err, user) => {
      console.log(user.id);
      const newMessage = await Message.create({
        text,
        room: id,
        user: user.id,
      });
    });

    return res.ok();
  },
};
