const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const API_key = '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';

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/generate', async (req, res) => {
  const { goal, calories, Country, diet } = req.body;
  const prompt = `Create a ${calories} calorie ${diet} meal plan for someone looking to ${goal}.The person is from ${Country}. Also suggest a workout plan`;

  console.log("Prompt:", prompt);

  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "anthropic/claude-3-sonnet",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        "Authorization": `Bearer ${API_key}`,
        "Content-Type": "application/json"
      }
    });

    const mealPlan = response.data.choices[0].message.content;
    res.render('result', { mealPlan, goal, calories, Country, diet });
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    res.send('Error generating response. Please try again.');
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});