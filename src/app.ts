(function() {    
    // The array to be sorted
    let array: number[] = [];
    // References to the HTML elements
    const canvas = document.getElementById("visualisation-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const generateBtn = document.getElementById("generate-array") as HTMLButtonElement;
    const sortBtn = document.getElementById("sort") as HTMLButtonElement;
    const speedSlider = document.getElementById("speed") as HTMLInputElement;
    const arraySizeSlider = document.getElementById("array-size") as HTMLInputElement;

    let animationDelay = 100;
    let isSorting = false;

    function generateRandomArray(size: number = 50): number[] {
        const arr: number[] = [];
        for (let i=0; i<size; i++) {
            arr.push(Math.floor(Math.random() * 95) + 5);
        }
        return arr;
    }

    function drawArray(arr: number[], highlights: {[key: number]: string} = {}) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
        const barWidth = canvas.width/arr.length;
        for (let i=0; i<arr.length; i++) {
            if (i < 0 || i >= arr.length) {
                continue;
            }
            const value = arr[i];
            if (value === undefined) {
                continue;
            }
            const barHeight = (value/100) * canvas.height;
            const x = i*barWidth;

            ctx.fillStyle = highlights[i] || "steelblue";
            ctx.fillRect(x, canvas.height-barHeight, barWidth-1, barHeight)
        }
    }

    async function bubbleSort(arr: number[]): Promise<void> {
        const len = arr.length;
        for (let i=0; i<len; i++) {
            for (let j=0; j<len-i-1; j++) {
                if (!isSorting) return;
                if (j + 1 >= arr.length) {
                    break; // Exit the inner loop if j+1 is out of bounds
                }
                const valueJ = arr[j];
                const valueJPlus1 = arr[j + 1];
                if (valueJ === undefined || valueJPlus1 === undefined) {
                    continue; // Skip this comparison if either is missing
                }
                // Show the 2 bars being compared
                drawArray(arr, {[j]: "red", [j+1]: "red"});
                await delay(animationDelay);

                // Show the 2 bars being swapped
                if (valueJ > valueJPlus1) {
                    drawArray(arr, {[j]: "orange", [j+1]: "orange"});
                    await delay(animationDelay);
                }

                [arr[j], arr[j + 1]] = [valueJPlus1, valueJ];

                // Show the new state after swap
                drawArray(arr, { [j]: 'green', [j+1]: 'green' });
                await delay(animationDelay);
            }
        }
    }




    // Helper function to make the delay code cleaner
    function delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function updateSpeed() {
        // Convert slider value to delay (higher slider = faster = lower delay)
        animationDelay = 200 - (parseInt(speedSlider.value) * 1.9);
    }


    function init() {
        updateSpeed();
        const initialSize = parseInt(arraySizeSlider.value)
        array = generateRandomArray(initialSize);
        drawArray(array);

        // Event Listeners
        generateBtn.addEventListener("click", () => {
            if (isSorting) return;
            const size = parseInt(arraySizeSlider.value);
            array = generateRandomArray(size);
            drawArray(array);
        });

        speedSlider.addEventListener("input", updateSpeed);

        arraySizeSlider.addEventListener("input", () => {
            if (isSorting) return;
            const size = parseInt(arraySizeSlider.value);
            array = generateRandomArray(size);
            drawArray(array);
        })

        sortBtn.addEventListener("click", async () => {
            // Disable the buttons while sorting
            isSorting = true
            generateBtn.disabled = true;
            sortBtn.disabled = true;
            // Get the selected algorithm
            const algorithm = (document.getElementById("algorithm-selector") as HTMLSelectElement).value;
            // Run the chosen algorithm
            if (algorithm === 'bubble') {
                await bubbleSort(array);
            } // ... else if for the other algorithms

            // Re-enable buttons when done
            isSorting = false;
            generateBtn.disabled = false;
            sortBtn.disabled = false;
            
            // Draw the final, sorted array
            drawArray(array);
        })
    }

    // Start the app
    init();
})();