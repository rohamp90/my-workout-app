const workoutDaySelect = document.getElementById('workout-day');
const exerciseList = document.getElementById('exercise-list');

// Event listener for workout day selection
workoutDaySelect.addEventListener('change', async function() {
  const selectedDay = workoutDaySelect.value;

  try {
    const response = await fetch(`/exercises/${selectedDay}`);
    const exercises = await response.json();

    console.log('Fetched exercises:', exercises); // Log the fetched exercises

    // Clear the current exercise list
    exerciseList.innerHTML = '';

    // Create exercise fields
    exercises.forEach(exercise => {
      const exerciseItem = document.createElement('div');
      exerciseItem.classList.add('exercise-item');
    
      // Use exercise.highestWeightFor12Reps to display the max weight from the last workout
      exerciseItem.innerHTML = `
        <label>${exercise._doc.exerciseName}</label>
        <small class="right-align" >Previous best: 
          <span class="highlight-weight">${exercise.highestWeightFor12Reps}</span> lbs
        </small>
        <div class="sets">
          ${[1, 2, 3].map(i => `
            <div class="set">
              <label>Set ${i}:</label>
              <input type="text" placeholder="Weight" />
              <input type="text" placeholder="Reps" />
            </div>
          `).join('')}
        </div>
      `;
    
      exerciseList.appendChild(exerciseItem);
    });
    
  } catch (error) {
    console.error('Error fetching exercises:', error);
  }
});

const workoutForm = document.getElementById('workout-form');

// Event listener for form submission
workoutForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the selected workout day
  const workoutDay = document.getElementById('workout-day').value;

  // Get all exercises and their corresponding sets
  const exerciseItems = document.querySelectorAll('.exercise-item');
  const exerciseData = [];

  exerciseItems.forEach(exerciseItem => {
    const exerciseName = exerciseItem.querySelector('label').innerText;
    const sets = [];

    // Get the weight and reps for each set
    const setInputs = exerciseItem.querySelectorAll('.set');
    setInputs.forEach(setInput => {
      const weight = setInput.querySelector('input[placeholder="Weight"]').value;
      const reps = setInput.querySelector('input[placeholder="Reps"]').value;
      sets.push({ weight, reps });
    });

    exerciseData.push({
      exerciseName,
      sets
    });
  });

  // Get comments
  const comments = document.getElementById('comments').value;

  // Prepare the data object to send
  const data = {
    workoutDay,
    exerciseData,
    comments
  };

  try {
    // Send the data to the server using a POST request
    const response = await fetch('/submit-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Check if the workout was saved successfully
    const result = await response.text();
    console.log(result);
    alert('Workout saved successfully!');

  } catch (error) {
    console.error('Error saving workout:', error);
    alert('Error saving workout');
  }
});


// Optionally trigger change on page load to load default exercises
window.onload = () => {
  workoutDaySelect.dispatchEvent(new Event('change'));
};