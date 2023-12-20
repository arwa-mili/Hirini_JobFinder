import ChatModel from "../models/chatModel.js";

export const createChat = async (req, res) =>
{
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    try
    {
        const existingChat = await ChatModel.findOne({
            members: { $all: [senderId, receiverId] },
        });

        if (existingChat)
        {
            return res.status(204).send(); // No Content for an existing chat
        }

        const newChat = new ChatModel({
            members: [senderId, receiverId],
        });

        const result = await newChat.save();
        res.status(201).json(result);
    } catch (error)
    {
        console.error('Error creating chat:', error);
        res.status(500).json(error);
    }
};



export const userChats = async (req, res) =>
{
    try
    {
        const chat = await ChatModel.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
    } catch (error)
    {
        res.status(500).json(error);
    }
};

export const findChat = async (req, res) =>
{
    try
    {
        const chat = await ChatModel.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });

        if (chat)
        {
            res.status(200).json(chat);
        } else
        {
            res.status(404).json({ message: 'Chat not found' });
        }
    } catch (error)
    {
        console.error('Error finding chat:', error);
        res.status(500).json(error);
    }
};
