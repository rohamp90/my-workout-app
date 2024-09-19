document.getElementById('workout-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const workoutDay = workoutDaySelect.value;
  const comments = document.getElementById('comments').value;

  // Collect exercise data
  const exerciseData = [];
  document.querySelectorAll('.exercise-item').forEach((item) => {
    const exerciseName = item.querySelector('label').textContent;
    const sets = [];
    item.querySelectorAll('.set').forEach((set) => {
      const weight = set.querySelector('input[type="text"]:nth-of-type(1)').value;
      const reps = set.querySelector('input[type="text"]:nth-of-type(2)').value;
      sets.push({ weight, reps });
    });
    exerciseData.push({ exerciseName, sets });
  });

  // Send data to the server
  try {
    await fetch('/submit-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workoutDay,
        exerciseData,
        comments
      })
    });
    alert('Workout data submitted!');
  } catch (error) {
    console.error('Error submitting workout data:', error);
  }
});