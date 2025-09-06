const array = [];
const MULT_FACTOR = 8;
let NUM_BARS = 50;
const MAX_VALUE = 30;

let animationSpeed = 300;
let comparisons = 0;
let swaps = 0;
let arrayAccesses = 0;
let isRunning = false;
let isPaused = false;
let startTime = 0;
let elapsedTime = 0;
let timeInterval = null;
let currentAlgorithm = 'Bubble Sort';

/**
 * Generates a new random array of bars and renders them in the container
 */
function generateArray() {
  if (isRunning && !isPaused) return;
  
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
    }, i * 10);
  }
  
  updateStatus('Ready to Sort', 'ready');
}

/**
 * Shuffles the existing array
 */
function shuffleArray() {
  if (isRunning && !isPaused) return;
  
  resetStats();
  
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap values
    const tempValue = array[i].value;
    array[i].value = array[j].value;
    array[j].value = tempValue;
    
    // Update visual representation
    array[i].element.style.height = (array[i].value * MULT_FACTOR) + "px";
    array[i].element.textContent = array[i].value;
    array[j].element.style.height = (array[j].value * MULT_FACTOR) + "px";
    array[j].element.textContent = array[j].value;
    
    // Remove any sorting classes
    array[i].element.classList.remove('sorted', 'comparing', 'swapping');
    array[j].element.classList.remove('sorted', 'comparing', 'swapping');
  }
  
  updateStatus('Ready to Sort', 'ready');
}

/**
 * Creates a single bar element representing a value
 */
function createBar(value) {
  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.style.height = "0px";
  bar.textContent = value;
  
  // Add size-based classes for responsive bar styling
  if (NUM_BARS <= 25) {
    bar.classList.add("small-array");
  } else if (NUM_BARS <= 50) {
    bar.classList.add("medium-array");
  } else if (NUM_BARS <= 75) {
    bar.classList.add("large-array");
  } else {
    bar.classList.add("extra-large-array");
  }
  
  return bar;
}

/**
 * Resets all statistics and timers
 */
function resetStats() {
  comparisons = 0;
  swaps = 0;
  arrayAccesses = 0;
  elapsedTime = 0;
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  updateStatsDisplay();
}

/**
 * Updates the displayed statistics in the UI
 */
function updateStatsDisplay() {
  document.getElementById('comparisons').textContent = comparisons;
  document.getElementById('swaps').textContent = swaps;
  document.getElementById('arrayAccesses').textContent = arrayAccesses;
  document.getElementById('timeElapsed').textContent = elapsedTime.toFixed(1) + 's';
}

/**
 * Updates the status indicator
 */
function updateStatus(text, className) {
  const statusElement = document.getElementById('statusIndicator');
  statusElement.textContent = text;
  statusElement.className = `status ${className}`;
}

/**
 * Starts the timer for tracking elapsed time
 */
function startTimer() {
  startTime = Date.now();
  timeInterval = setInterval(() => {
    if (!isPaused) {
      elapsedTime = (Date.now() - startTime) / 1000;
      updateStatsDisplay();
    }
  }, 100);
}

/**
 * Bubble Sort Algorithm
 */
async function bubbleSort() {
  const len = array.length;
  
  for (let i = 0; i < len; i++) {
    let swapped = false;
    
    for (let j = 0; j < len - i - 1; j++) {
      if (!isRunning) return;
      
      while (isPaused) {
        await sleep(50);
        if (!isRunning) return;
      }
      
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
}

/**
 * Selection Sort Algorithm
 */
async function selectionSort() {
  const len = array.length;
  
  for (let i = 0; i < len; i++) {
    if (!isRunning) return;
    
    let minIndex = i;
    array[minIndex].element.classList.add('comparing');
    
    for (let j = i + 1; j < len; j++) {
      if (!isRunning) return;
      
      while (isPaused) {
        await sleep(50);
        if (!isRunning) return;
      }
      
      await highlightComparison(minIndex, j);
      
      if (array[j].value < array[minIndex].value) {
        array[minIndex].element.classList.remove('comparing');
        minIndex = j;
        array[minIndex].element.classList.add('comparing');
      }
      
      removeHighlight(minIndex, j, 'comparing');
    }
    
    if (minIndex !== i) {
      await performSwap(i, minIndex);
    }
    
    array[minIndex].element.classList.remove('comparing');
    array[i].element.classList.add('sorted');
  }
}

/**
 * Insertion Sort Algorithm
 */
async function insertionSort() {
  const len = array.length;
  array[0].element.classList.add('sorted');
  
  for (let i = 1; i < len; i++) {
    if (!isRunning) return;
    
    let key = array[i].value;
    let j = i - 1;
    
    array[i].element.classList.add('comparing');
    
    while (j >= 0) {
      if (!isRunning) return;
      
      while (isPaused) {
        await sleep(50);
        if (!isRunning) return;
      }
      
      await highlightComparison(j, j + 1);
      
      if (array[j].value <= key) {
        removeHighlight(j, j + 1, 'comparing');
        break;
      }
      
      // Shift element to the right
      array[j + 1].value = array[j].value;
      array[j + 1].element.style.height = (array[j + 1].value * MULT_FACTOR) + "px";
      array[j + 1].element.textContent = array[j + 1].value;
      arrayAccesses += 2;
      updateStatsDisplay();
      
      removeHighlight(j, j + 1, 'comparing');
      j--;
      
      await sleep(animationSpeed / 2);
    }
    
    array[j + 1].value = key;
    array[j + 1].element.style.height = (key * MULT_FACTOR) + "px";
    array[j + 1].element.textContent = key;
    array[j + 1].element.classList.remove('comparing');
    array[j + 1].element.classList.add('sorted');
    
    arrayAccesses++;
    updateStatsDisplay();
  }
}

/**
 * Quick Sort Algorithm (main function)
 */
async function quickSort() {
  await quickSortHelper(0, array.length - 1);
  
  // Mark all as sorted
  for (let i = 0; i < array.length; i++) {
    array[i].element.classList.add('sorted');
    await sleep(30);
  }
}

/**
 * Quick Sort Helper (recursive)
 */
async function quickSortHelper(low, high) {
  if (low < high && isRunning) {
    let pivotIndex = await partition(low, high);
    
    if (pivotIndex !== -1) {
      await quickSortHelper(low, pivotIndex - 1);
      await quickSortHelper(pivotIndex + 1, high);
    }
  }
}

/**
 * Partition function for Quick Sort
 */
async function partition(low, high) {
  let pivot = array[high].value;
  array[high].element.classList.add('comparing');
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (!isRunning) return -1;
    
    while (isPaused) {
      await sleep(50);
      if (!isRunning) return -1;
    }
    
    await highlightComparison(j, high);
    
    if (array[j].value < pivot) {
      i++;
      if (i !== j) {
        await performSwap(i, j);
      }
    }
    
    removeHighlight(j, high, 'comparing');
  }
  
  if (i + 1 !== high) {
    await performSwap(i + 1, high);
  }
  
  array[high].element.classList.remove('comparing');
  return i + 1;
}

/**
 * Merge Sort Algorithm (main function)
 */
async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);
  
  // Mark all as sorted
  for (let i = 0; i < array.length; i++) {
    array[i].element.classList.add('sorted');
    await sleep(30);
  }
}

/**
 * Merge Sort Helper (recursive)
 */
async function mergeSortHelper(left, right) {
  if (left < right && isRunning) {
    let middle = Math.floor((left + right) / 2);
    
    await mergeSortHelper(left, middle);
    await mergeSortHelper(middle + 1, right);
    await merge(left, middle, right);
  }
}

/**
 * Merge function for Merge Sort
 */
async function merge(left, middle, right) {
  let leftArray = [];
  let rightArray = [];
  
  // Copy data to temp arrays
  for (let i = left; i <= middle; i++) {
    leftArray.push(array[i].value);
  }
  for (let i = middle + 1; i <= right; i++) {
    rightArray.push(array[i].value);
  }
  
  let i = 0, j = 0, k = left;
  
  while (i < leftArray.length && j < rightArray.length) {
    if (!isRunning) return;
    
    while (isPaused) {
      await sleep(50);
      if (!isRunning) return;
    }
    
    array[k].element.classList.add('comparing');
    comparisons++;
    arrayAccesses += 2;
    
    if (leftArray[i] <= rightArray[j]) {
      array[k].value = leftArray[i];
      i++;
    } else {
      array[k].value = rightArray[j];
      j++;
    }
    
    array[k].element.style.height = (array[k].value * MULT_FACTOR) + "px";
    array[k].element.textContent = array[k].value;
    updateStatsDisplay();
    
    await sleep(animationSpeed);
    array[k].element.classList.remove('comparing');
    k++;
  }
  
  while (i < leftArray.length) {
    if (!isRunning) return;
    array[k].value = leftArray[i];
    array[k].element.style.height = (array[k].value * MULT_FACTOR) + "px";
    array[k].element.textContent = array[k].value;
    arrayAccesses++;
    updateStatsDisplay();
    i++;
    k++;
  }
  
  while (j < rightArray.length) {
    if (!isRunning) return;
    array[k].value = rightArray[j];
    array[k].element.style.height = (array[k].value * MULT_FACTOR) + "px";
    array[k].element.textContent = array[k].value;
    arrayAccesses++;
    updateStatsDisplay();
    j++;
    k++;
  }
}

/**
 * Highlights two bars being compared during sorting
 */
async function highlightComparison(index1, index2) {
  array[index1].element.classList.add('comparing');
  array[index2].element.classList.add('comparing');
  comparisons++;
  arrayAccesses += 2;
  updateStatsDisplay();
  await sleep(animationSpeed);
}

/**
 * Swaps the values of two bars and animates the change
 */
async function performSwap(index1, index2) {
  array[index1].element.classList.add('swapping');
  array[index2].element.classList.add('swapping');
  
  const temp = array[index1].value;
  array[index1].value = array[index2].value;
  array[index2].value = temp;
  
  swaps++;
  arrayAccesses += 4; // 2 reads, 2 writes
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
 */
function removeHighlight(index1, index2, className) {
  if (array[index1]) array[index1].element.classList.remove(className);
  if (array[index2]) array[index2].element.classList.remove(className);
}

/**
 * Marks all remaining bars as sorted
 */
async function markRemainingSorted(startIndex) {
  for (let k = 0; k < startIndex; k++) {
    array[k].element.classList.add('sorted');
    await sleep(30);
  }
}

/**
 * Creates a delay for animations
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Updates the animation speed
 */
function updateSpeed(value) {
  animationSpeed = parseInt(value);
  document.getElementById('speedDisplay').textContent = value + 'ms';
  document.getElementById('speedLabel').textContent = value + 'ms';
}

/**
 * Updates the array size
 */
function updateSize(value) {
  NUM_BARS = parseInt(value);
  document.getElementById('sizeValue').textContent = value;
  if (!isRunning) {
    generateArray();
  }
}

/**
 * Starts the sorting process
 */
async function startSort() {
  if (isRunning && !isPaused) return;
  
  if (isPaused) {
    isPaused = false;
    updateStatus('Sorting...', 'running');
    return;
  }
  
  isRunning = true;
  isPaused = false;
  
  // Clear any existing visual states
  array.forEach(item => {
    item.element.classList.remove('sorted', 'comparing', 'swapping');
  });
  
  resetStats();
  startTimer();
  updateStatus('Sorting...', 'running');
  
  try {
    switch (currentAlgorithm) {
      case 'Bubble Sort':
        await bubbleSort();
        break;
      case 'Selection Sort':
        await selectionSort();
        break;
      case 'Insertion Sort':
        await insertionSort();
        break;
      case 'Quick Sort':
        await quickSort();
        break;
      case 'Merge Sort':
        await mergeSort();
        break;
    }
    
    if (isRunning) {
      updateStatus('Sorting Complete!', 'ready');
    }
  } catch (error) {
    console.error('Sorting error:', error);
    updateStatus('Error occurred', 'paused');
  }
  
  isRunning = false;
  isPaused = false;
  
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
}

/**
 * Pauses/resumes the sorting
 */
function pauseSort() {
  if (!isRunning) return;
  
  isPaused = !isPaused;
  
  if (isPaused) {
    updateStatus('Paused', 'paused');
  } else {
    updateStatus('Sorting...', 'running');
  }
}

/**
 * Resets the visualization
 */
function resetSort() {
  isRunning = false;
  isPaused = false;
  
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  
  array.forEach(item => {
    item.element.classList.remove('sorted', 'comparing', 'swapping');
  });
  
  resetStats();
  updateStatus('Ready to Sort', 'ready');
}

/**
 * Handles keyboard shortcuts
 */
function handleKeyPress(event) {
  switch (event.code) {
    case 'Space':
      event.preventDefault();
      pauseSort();
      break;
    case 'Enter':
      event.preventDefault();
      startSort();
      break;
    case 'KeyR':
      if (!isRunning) {
        resetSort();
      }
      break;
    case 'KeyG':
      if (!isRunning) {
        generateArray();
      }
      break;
  }
}

/**
 * Initializes the sorting visualizer
 */
function initialize() {
  generateArray();
  
  // Set up event listeners
  document.getElementById('algorithm').addEventListener('change', (e) => {
    currentAlgorithm = e.target.value;
    if (!isRunning) resetSort();
  });
  
  document.getElementById('size').addEventListener('input', (e) => {
    updateSize(e.target.value);
  });
  
  document.getElementById('speed').addEventListener('input', (e) => {
    updateSpeed(e.target.value);
  });
  
  document.getElementById('generateBtn').addEventListener('click', generateArray);
  document.getElementById('shuffleBtn').addEventListener('click', shuffleArray);
  document.getElementById('startBtn').addEventListener('click', startSort);
  document.getElementById('pauseBtn').addEventListener('click', pauseSort);
  document.getElementById('resetBtn').addEventListener('click', resetSort);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyPress);
  
  // Initialize UI values
  updateSpeed(animationSpeed);
  updateSize(NUM_BARS);
  updateStatus('Ready to Sort', 'ready');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}