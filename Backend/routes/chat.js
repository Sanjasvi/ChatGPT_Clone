import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIAPIResponse from '../utils/openai.js';

const router = express.Router();

//test api end point
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc1234",
            title: "Testing New Thread3"
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

//Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

//Get chat messages for a specific thread
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

//Delete a specific thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

//Handle chat messages
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
         res.status(400).json({ error: "threadId and message are required" });
    }

    try { 
        // Integrate with OpenAI API to get assistant response
        let thread = await Thread.findOne({ threadId});

        if (!thread) {
            // Create a new thread in the DB if it doesn't exist 
            thread = new Thread({ 
                threadId,
                 title: message, 
                 messages: [{role:"user", content:message}]
                 });
        }else{
            // Append user message to existing thread
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = Date.now();
        await thread.save();

        res.json({ reply: assistantReply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" }); 
    }
});


export default router;