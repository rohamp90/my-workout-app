const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Connect to MongoDB (replace <dburl> with your MongoDB connection string)
mongoose.connect('<dburl>', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a Workout model
const workoutSchema = new mongoose.Schema({
  workoutDay: String,
  exercises: [{ 
    exerciseName: String,
    sets: [{ weight: String, reps: String }]
  }],
  comments: String,
  date: { type: Date, default: Date.now }
});

const Workout = mongoose.model('Workout', workoutSchema);

// Route to handle form submissions
app.post('/submit-workout', async (req, res) => {
  try {
    const workout = new Workout({
      workoutDay: req.body.workoutDay,
      exercises: req.body.exerciseData,
      comments: req.body.comments
    });

    await workout.save();
    res.send('Workout data saved!');
  } catch (err) {
    res.status(500).send('Error saving workout data');
  }
});

// Route to get previous workouts
app.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).send('Error fetching workout data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});