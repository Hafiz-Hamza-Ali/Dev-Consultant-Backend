const db = require("../models/");
const Message = db.message;
const User = db.User;
const path = require("path");

class MessageService {
  static createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const newMessage = {
      senderId,
      chatId,
      text: text,
    };
    try {
      const chatMessage = await Message.create(newMessage);

      res.status(201).json({
        status: "success",
        chatMessage,
      });
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to register user: " + error.message,
      });
    }
  };

  static getMessages = async (req, res) => {
    try {
      const { chatId } = req.params;

      const messageHistory = await Message.findAll({
        where: {
          chatId: chatId,
        },
      });

      res.status(200).json({
        status: "success",
        data: messageHistory,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: "Unable to get chat: " + error.message,
      });
    }
  };
  static chatFile = async (req, res) => {
    const chatFile = req.file;

    if (!chatFile) {
      return res.status(400).json({
        status: "failed",
        message: "No file provided",
      });
    }
    const d = new Date();
    let hour = d.getUTCHours().toString();
    let minutes = d.getUTCMinutes().toString();
    let date = d.getUTCDate().toString();
    let year = d.getUTCFullYear().toString();
    const uniqueSuffix =
      hour + minutes + date + year + "-" + chatFile.originalname;
    // You may want to specify some file extensions to exclude them
    // for security reasons, such as executable files
    const forbiddenExtensions = [".exe", ".dll", ".so", ".bat"];
    const fileExtension = path.extname(chatFile.originalname);
    const fileSize = chatFile.size / 1024;
    const roundedSizeKB = fileSize.toFixed(0);
    const fileData = {
      fileSize: roundedSizeKB,
      fileName: chatFile.originalname,
    };
    // console.log(fileSize);
    // console.log("chatFile.originalname", chatFile.originalname);
    if (forbiddenExtensions.includes(fileExtension.toLowerCase())) {
      return res.status(400).json({
        status: "failed",
        message:
          "The provided file type is not supported or potentially harmful",
      });
    }

    if (fileSize > 2000) {
      return res.status(400).json({
        status: "failed",
        message: "Chat file size should be less than or equal to 5 MB",
      });
    }

    res.status(200).json({
      status: "success",
      filePath: uniqueSuffix,
      fileDetails: fileData,
    });
  };
}
module.exports = MessageService;
