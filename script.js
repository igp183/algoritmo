const array = [];
const MULT_FACTOR = 8;
const NUM_BARS = 25;
const MAX_VALUE = 30;

let animationSpeed = 300;
let comparisons = 0;
let swaps = 0;
let isRunning = false;

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

function createBar(value) {
  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.style.height = "0px";
  bar.textContent = value;
  return bar;
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  updateStatsDisplay();
}

function updateStatsDisplay() {
  document.getElementById('comparisons').textContent = comparisons;
  document.getElementById('swaps').textContent = swaps;
}

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

async function highlightComparison(index1, index2) {
  array[index1].element.classList.add('comparing');
  array[index2].element.classList.add('comparing');
  comparisons++;
  updateStatsDisplay();
  await sleep(animationSpeed);
}

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

function removeHighlight(index1, index2, className) {
  array[index1].element.classList.remove(className);
  array[index2].element.classList.remove(className);
}

async function markRemainingSorted(startIndex) {
  for (let k = 0; k < startIndex; k++) {
    array[k].element.classList.add('sorted');
    await sleep(30);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateSpeed(value) {
  animationSpeed = parseInt(value);
  document.getElementById('speedDisplay').textContent = value + 'ms';
}

function startSort() {
  if (isRunning) return;
  
  array.forEach(item => {
    item.element.classList.remove('sorted', 'comparing', 'swapping');
  });
  
  bubbleSort();
}

function initialize() {
  generateArray();
  document.getElementById('speed').value = animationSpeed;
  document.getElementById('speedDisplay').textContent = animationSpeed + 'ms';
}

initialize();