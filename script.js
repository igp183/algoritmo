const array = [];
const multFactor = 8;
const numBars = 25;
const maxValue = 30;
let animationSpeed = 300;
let comparisons = 0;
let swaps = 0;
let isRunning = false;

function generateArray() {
    if (isRunning) return;

    const container = document.getElementById("array-container");
    container.innerHTML = "";
    array.length = 0;

    comparisons = 0;
    swaps = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';

    for (let i = 0; i < numBars; i++) {
        const value = Math.floor(Math.random() * maxValue) + 1;
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = "0px";
        bar.textContent = value;
        container.appendChild(bar);
        array.push({ value, element: bar });

        // Set final height after a small delay to trigger transition
        setTimeout(() => {
            bar.style.height = (value * multFactor) + "px";
        }, 10);
    }
}

async function bubbleSort() {
    if (isRunning) return;
    isRunning = true;

    const len = array.length;

    for (let i = 0; i < len; i++) {
        let swapped = false;

        for (let j = 0; j < len - i - 1; j++) {
            array[j].element.classList.add('comparing');
            array[j + 1].element.classList.add('comparing');

            comparisons++;
            document.getElementById('comparisons').textContent = comparisons;
            await new Promise(r => setTimeout(r, animationSpeed));

            if (array[j].value > array[j + 1].value) {
                array[j].element.classList.add('swapping');
                array[j + 1].element.classList.add('swapping');

                // Swap values
                const temp = array[j].value;
                array[j].value = array[j + 1].value;
                array[j + 1].value = temp;

                swaps++;
                document.getElementById('swaps').textContent = swaps;

                array[j].element.style.height = (array[j].value * multFactor) + "px";
                array[j + 1].element.style.height = (array[j + 1].value * multFactor) + "px";

                setTimeout(() => {
                    array[j].element.textContent = array[j].value;
                    array[j + 1].element.textContent = array[j + 1].value;
                }, animationSpeed / 2);

                await new Promise(r => setTimeout(r, animationSpeed));

                array[j].element.classList.remove('swapping');
                array[j + 1].element.classList.remove('swapping');

                swapped = true;
            }

            array[j].element.classList.remove('comparing');
            array[j + 1].element.classList.remove('comparing');
        }

        array[len - i - 1].element.classList.add('sorted');

        if (!swapped) {
            // Mark remaining unsorted bars as sorted after early exit
            for (let k = 0; k < len - i - 1; k++) {
                array[k].element.classList.add('sorted');
                await new Promise(r => setTimeout(r, 30));
            }
            break;
        }
    }

    isRunning = false;
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

// Initialize
generateArray();
document.getElementById('speed').value = animationSpeed;
document.getElementById('speedDisplay').textContent = animationSpeed + 'ms';