const array = [];
const MULT_FACTOR = 8;
const NUM_BARS = 25;
const MAX_VALUE = 30;

let animationSpeed = 300;
let comparisons = 0;
let swaps = 0;
let isRunning = false;

/**
 * Generates a new random array of bars and renders them in the container
 * - Clears the existing array and bars
 * - Resets comparisons and swaps
 * - Creates NUM_BARS between 1 and MAX_VALUE
 * - Animates the bars growing to their designated height
 * 
 * Prevents execution if a sorting algorithm is currently running
 */
function generateArray() {
  if (isRunning) return;
  
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  array.length = 0;
  
  resetStats();
  
  for (let i = 0; i < NUM_BARS; i++) {
    const value = Math.floor(Math.random() * MAX_VALUE) + 1;
    const bar = createBar(value);
    
    container.appendChild(bar);
    array.push({ value, element: bar });
    
    setTimeout(() => {
      bar.style.height = (value * MULT_FACTOR) + "px";
    }, 10);
  }
}

/**
 * Creates a single bar element representing a value
 * @param {number} value - The value of the bar from 1 to MAX_VALUE
 * @return {HTMLDivElement} A div element styled as a bar with text showing a value
 */
function createBar(value) {
  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.style.height = "0px";
  bar.textContent = value;
  return bar;
}

/**
 * Resets comparison and swap counters to zero then updates the UI
 */
function resetStats() {
  comparisons = 0;
  swaps = 0;
  updateStatsDisplay();
}

/**
 * Updates the displayed statistics in the UI
 */
function updateStatsDisplay() {
  document.getElementById('comparisons').textContent = comparisons;
  document.getElementById('swaps').textContent = swaps;
}

/**
 * Performs the bubble sort algorithm on the global array
 * - Stops early if no swaps are made in a pass (optimization)
 * 
 * Prevents multiple executions by checking and setting the isRunning
 */
async function bubbleSort() {
  if (isRunning) return;
  isRunning = true;
  
  const len = array.length;
  
  for (let i = 0; i < len; i++) {
    let swapped = false;
    
    for (let j = 0; j < len - i - 1; j++) {
      await highlightComparison(j, j + 1);
      
      if (array[j].value > array[j + 1].value) {
        await performSwap(j, j + 1);
        swapped = true;
      }
      
      removeHighlight(j, j + 1, 'comparing');
    }
    
    array[len - i - 1].element.classList.add('sorted');
    
    if (!swapped) {
      await markRemainingSorted(len - i - 1);
      break;
    }
  }
  
  isRunning = false;
}

/**
 * Highlights two bars being compared during sorting
 * - Adds the 'comparing' CSS class to both bars
 * - Increments the global comparisons counter
 * - Pauses execution during animaitonSpeed time
 * 
 * @param {number} index1 - Index of the first bar
 * @param {number} index2 - Index of the second bar
 */
async function highlightComparison(index1, index2) {
  array[index1].element.classList.add('comparing');
  array[index2].element.classList.add('comparing');
  comparisons++;
  updateStatsDisplay();
  await sleep(animationSpeed);
}

/**
 * Swaps the values of two bars and animates the change
 * - Adds the 'swapping' CSS class to both the bars
 * - Swaps their value properties
 * - Updates bar heights and labels
 * - Increments the global swaps counter
 * - Waits for animaitonSpeed duration before removing highlight
 * 
 * @param {number} index1 - Index of the first bar
 * @param {number} index2 - Index of the second bar
 */
async function performSwap(index1, index2) {
  array[index1].element.classList.add('swapping');
  array[index2].element.classList.add('swapping');
  
  const temp = array[index1].value;
  array[index1].value = array[index2].value;
  array[index2].value = temp;
  
  swaps++;
  updateStatsDisplay();
  
  array[index1].element.style.height = (array[index1].value * MULT_FACTOR) + "px";
  array[index2].element.style.height = (array[index2].value * MULT_FACTOR) + "px";
  
  setTimeout(() => {
    array[index1].element.textContent = array[index1].value;
    array[index2].element.textContent = array[index2].value;
  }, animationSpeed / 2);
  
  await sleep(animationSpeed);
  
  array[index1].element.classList.remove('swapping');
  array[index2].element.classList.remove('swapping');
}

/**
 * Removes a specific CSS class from two bars
 * @param {number} index1 - Index of the first bar
 * @param {number} index2 - Index of the second bar
 * @param {string} className - The class to remove
 */
function removeHighlight(index1, index2, className) {
  array[index1].element.classList.remove(className);
  array[index2].element.classList.remove(className);
}

/**markRem
 * Marks all remaining bars as sorted starting from index 0 up to startIndex - 1
 * - Used when the array becomes sorted before completing all passes
 * - Adds the 'sorted' class with a slight delay for visual effect
 * @param {number} startIndex - Index where sorted section starts
 */
async function markRemainingSorted(startIndex) {
  for (let k = 0; k < startIndex; k++) {
    array[k].element.classList.add('sorted');
    await sleep(30);
  }
}

/**
 * Creates a delay for animations
 * @param {number} ms - Time in miliseconds to pause execution
 * @returns {Promise<void>} Resolves after ms miliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Updates the animation speed for sorting
 * - Sets animationSpeed to the given value
 * - Updates the UI to show the new speed
 * @param {number} value - The new animation speed in miliseconds
 */
function updateSpeed(value) {
  animationSpeed = parseInt(value);
  document.getElementById('speedDisplay').textContent = value + 'ms';
}

/**
 * Initiates the Bubble Sort
 * - Prevents starting if a sort is already running
 * - Clears any existing visual states
 * - Calls bubbleSort() to start sorting
 * @returns 
 */
function startSort() {
  if (isRunning) return;
  
  array.forEach(item => {
    item.element.classList.remove('sorted', 'comparing', 'swapping');
  });
  
  bubbleSort();
}

/**
 * Initializes the sorting visualizer on page load
 * - Generates the initial random array
 * - Sets the speed control slider and display to match animationSpeed
 */
function initialize() {
  generateArray();
  document.getElementById('speed').value = animationSpeed;
  document.getElementById('speedDisplay').textContent = animationSpeed + 'ms';
}

initialize();