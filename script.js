//script.js
const array = [];

function generateArray() {
    const container = document.getElementById("array-container")
    container.innerHTML = "";
    array.length = 0; // Clear the array

    for (let i = 0; i < 20; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = (value * 2) + "px"; //e.g. 100px, just 100 isn't valid (alternative to `{value*2}px`)
        container.appendChild(bar);
        bar.textContent = value;

        container.appendChild(bar);
        array.push({ value, element: bar })
    }
}

async function bubbleSort() {
    const len = array.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (array[j].value > array[j + 1].value) {
                await new Promise(r => setTimeout(r, 100));

                // Swap values
                const temp = array[j].value;
                array[j].value = array[j + 1].value;
                array[j + 1].value = temp;

                // Update bars
                array[j].element.style.height = (array[j].value * 2) + "px";
                array[j].element.textContent = array[j].value;
                array[j + 1].element.style.height = (array[j + 1].value * 2) + "px";
                array[j + 1].element.textContent = array[j + 1].value;
            }
        }
    }
}

function startSort() {
    bubbleSort();
}

generateArray();