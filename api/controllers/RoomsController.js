/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var PubNub = require("pubnub");

module.exports = {
  index: (req, res) => {
    if (!req.body && !req.session.userId) {
      res.redirect("/");
    } else if (req.body) {
      const { username } = req.body;
      User.findOrCreate({ username }, { username }).exec((err, user) => {
        if (err) {
          res.send(500, { error: "Could not find user" });
        }
        req.session.userId = user.id;
        Room.find({}).exec((err, rooms) => {
          if (err) {
            res.send(500, { error: "Could not find chatrooms" });
          }
          console.log(req.session);
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
          console.log(req.session);
          res.view("rooms/index", { rooms, user });
        });
      });
    }
  },

  new: (req, res) => {
    Room.find({}).exec((err, rooms) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      res.view("rooms/new", { rooms });
    });
  },

  create: (req, res) => {
    const newRoom = { topic: req.body.topic };
    Room.create(newRoom).exec((err) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      res.redirect("/rooms");
    });
  },

  show: async (req, res) => {
    const { id } = req.params;

    //Pubnub Set Up
    // const pubnub = new PubNub({
    // replace the key placeholders with your own PubNub publish and subscribe keys
    //   publishKey: "pub-c-4e92a762-6a51-4356-ba35-7b9f926589ce",
    //   subscribeKey: "sub-c-15adbaec-ae7d-11ea-b622-0efe000536d8",
    //   uuid: "theClientUUID",
    // });

    // console.log(pubnub);

    // pubnub.addListener({
    // message: function (event) {
    //   displayMessage(
    //     "[MESSAGE: received]",
    //     event.message.entry + ": " + event.message.update
    //   );
    // },
    // presence: function (event) {
    //   displayMessage(
    //     "[PRESENCE: " + event.action + "]",
    //     "uuid: " + event.uuid + ", channel: " + event.channel
    //   );
    // },
    // status: function (event) {
    //   displayMessage(
    //     "[STATUS: " + event.category + "]",
    //     "connected to channels: " + event.affectedChannels
    //   );
    //   if (event.category == "PNConnectedCategory") {
    //     submitUpdate(theEntry, "Harmless.");
    //   }
    // },
    // });

    // const allRoomsObjects = await Room.find({});
    // const currentRoom = await Room.findOne({ id });

    // allRoomsTopics = allRoomsObjects.map((room) => room.topic);
    // console.log(allRoomsTopics);
    // pubnub.subscribe({
    //   channels: allRoomsTopics,
    //   withPresence: true,
    // });

    // const theChannel = currentRoom.topic;
    // const theEntry = "Person";

    // console.log(theChannel);
    //

    Room.findOne({ id })
      .populate("messages")
      .exec((err, room) => {
        console.log(room);
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        if (!room) {
          res.redirect("/rooms");
        }
        res.view("rooms/show", { room });
      });
  },
};
