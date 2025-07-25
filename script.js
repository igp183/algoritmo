//script.js
const array = [];
const multFactor = 10;
const numBars = 20;
const maxValue = 30;
let animationSpeed = 100;
let comparisons = 0;
let swaps = 0;

function generateArray() {
    const container = document.getElementById("array-container")
    container.innerHTML = "";
    array.length = 0; // Clear the array
    comparisons = 0;
    swaps = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0'

    for (let i = 0; i < numBars; i++) {
        const value = Math.floor(Math.random() * maxValue) + 1;
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = (value * multFactor) + "px"; //e.g. 100px, just 100 isn't valid (alternative to `{value*2}px`)
        bar.textContent = value;
        container.appendChild(bar);
        array.push({ value, element: bar })
    }
}

async function bubbleSort() {
    const len = array.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            // Add highlight
            array[j].element.classList.add('comparing');
            array[j+1].element.classList.add('comparing');
            
            comparisons++;
            document.getElementById('comparisons').textContent = comparisons;

            await new Promise(r => setTimeout(r, animationSpeed));
            
            if (array[j].value > array[j + 1].value) {

                // Swap values
                array[j].element.classList.add('swapping');
                array[j+1].element.classList.add('swapping');
                const temp = array[j].value;
                array[j].value = array[j + 1].value;
                array[j + 1].value = temp;
                swaps++;
                document.getElementById('swaps').textContent = swaps;

                // Update bars
                array[j].element.style.height = (array[j].value * multFactor) + "px";
                array[j].element.textContent = array[j].value;
                array[j + 1].element.style.height = (array[j + 1].value * multFactor) + "px";
                array[j + 1].element.textContent = array[j + 1].value;

                await new Promise(r => setTimeout(r, Math.min(animationSpeed, 200)));
                array[j].element.classList.remove('swapping');
                array[j+1].element.classList.remove('swapping');
            }

            // Remove highlight
            array[j].element.classList.remove('comparing');
            array[j+1].element.classList.remove('comparing');
        }
        // Mark as sorted
        array[len - i - 1].element.classList.add('sorted');
    }
}

function updateSpeed(value) {
    animationSpeed = parseInt(value);
    document.getElementById('speedDisplay').textContent = value + 'ms';
}

function startSort() {
    array.forEach(item => item.element.classList.remove('sorted'));
    bubbleSort();
}

generateArray();

document.getElementById('speed').value = animationSpeed;
document.getElementById('speedDisplay').textContent = animationSpeed + 'ms';