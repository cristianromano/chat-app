import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
export const getUserSideBar = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: req.userId },
      ],
    }).sort({ createdAt: 1 });

    if (!messages) {
      return res.status(404).json({ message: "Messages not found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    let imgCloud = "";

    if (image) {
      const res = await cloudinary.uploader.upload(image);
      imgCloud = res.secure_url;
    }

    const message = new Message({
      text: text || null,
      image: imgCloud || null,
      senderId: req.userId,
      receiverId,
    });

    const newMessage = await message.save();

    const getSocketId = getRecieverSocketId(receiverId);
    if (getSocketId) io.to(getSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
