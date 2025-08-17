const express = require('express');
const router = express.Router();
const Summary = require('/models/Summary.js');
const nodemailer = require('nodemailer');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// summarize endpoint: generates summary from transcript + prompt
router.post('/summarize', async (req, res) => {
  try {
    const { transcript, prompt } = req.body;
    if (!transcript) return res.status(400).json({ error: 'No transcript provided' });

    const systemPrompt = `You are a helpful assistant that summarizes meeting transcripts. Output should be concise and structured.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Transcript:\n\n${transcript}\n\nInstruction: ${prompt || 'Summarize the transcript into bullet points with action items highlighted.'}` }
    ];

    // call OpenAI
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini', // replace with available model if needed
      messages,
      max_tokens: 800,
      temperature: 0.2
    });

    const generated = completion.data.choices?.[0]?.message?.content?.trim() || 'No summary returned';

    // save to DB
    const doc = new Summary({ transcript, prompt, generatedSummary: generated, editedSummary: generated });
    await doc.save();

    res.json({ id: doc._id, generatedSummary: generated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// update edited summary & optionally send email
router.post('/save-and-share', async (req, res) => {
  try {
    const { id, editedSummary, recipients } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const doc = await Summary.findById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    doc.editedSummary = editedSummary;
    doc.recipients = recipients || [];
    await doc.save();

    // send email if recipients provided
    if (recipients && recipients.length > 0) {
      // configure transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(','),
        subject: 'Shared Meeting Summary',
        text: editedSummary,
        html: `<pre style="font-family:inherit;">${editedSummary}</pre>`
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
