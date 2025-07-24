//script.js
function generateArray() {
    const container = document.getElementById("array-container")
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = (value * 2) + "px"; //e.g. 100px, just 100 isn't valid (alternative to `{value*2}px`)
        container.appendChild(bar);
    }
}

async function startSort() {
    const bars = document.querySelectorAll(".bar");
    for (let i = 0; i < bars.length; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            const h1 = parseInt(bars[j].style.height);
            const h2 = parseInt(bars[j + 1].style.height);
            if (h1 > h2) {
                await new Promise(r => setTimeout(r, 100));
                bars[j].style.height = h2 + "px";
                bars[j + 1].style.height = h1 + "px";
            }
        }
    }
}

generateArray();