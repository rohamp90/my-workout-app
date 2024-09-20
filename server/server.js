// server.js
require('dotenv').config();
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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Exercise model
const exerciseSchema = new mongoose.Schema({
  workoutDay: String,
  exercises: [
    {
      exerciseName: String
    }
  ]
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

// Define Workout model
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

// Route to get exercises for a specific workout day
app.get('/exercises/:day', async (req, res) => {
  try {
    const day = req.params.day;
    const exerciseDocument = await Exercise.findOne({ workoutDay: day });

    console.log("Requested workout day:", day);
    console.log("Exercise Document:", exerciseDocument); // Pretty print

    if (exerciseDocument && exerciseDocument.exercises) {
      res.json(exerciseDocument.exercises); // Send the exercises array
    } else {
      console.log('No exercises found for this workout day');
      res.json([]); // Respond with an empty array
    }
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).send('Error fetching exercises');
  }
});

app.get('/test-db', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    console.error('Error fetching all exercises:', err);
    res.status(500).send('Error fetching exercises');
  }
});

// Route to handle form submissions
app.post('/submit-workout', async (req, res) => {
  try {
    const workout = new Workout({
      workoutDay: req.body.workoutDay,
      exercises: req.body.exerciseData, // This is the array of exercises with sets
      comments: req.body.comments
    });

    await workout.save();
    res.send('Workout data saved!');
  } catch (err) {
    console.error('Error saving workout data:', err);
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