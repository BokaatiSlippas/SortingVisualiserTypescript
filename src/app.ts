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

    let animationDelay = 10;
    let isSorting = false;

    function generateRandomArray(size: number = 50): number[] {
        const arr: number[] = [];
        const min = 5;
        const max = 100;
        const step = (max - min) / (size - 1);
        for (let i = 0; i < size; i++) {
            arr.push(Math.round(min + (step * i)));
        }
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
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
        for (let pass=0; pass<len; pass++) {
            for (let i=0; i<len-pass-1; i++) {
                if (!isSorting) return;
                if (i+1 >= arr.length) {
                    break; // Exit the inner loop if out of bounds
                }
                const valueI = arr[i];
                const valueIPlus1 = arr[i+1];
                if (valueI === undefined || valueIPlus1 === undefined) {
                    continue; // Skip this comparison if either is missing
                }

                // Show the 2 bars being compared
                drawArray(arr, {[i]: "green", [i+1]: "green"});
                await delay(animationDelay);

                if (valueI > valueIPlus1) {
                    [arr[i], arr[i+1]] = [valueIPlus1, valueI];
                    drawArray(arr, {[i]: "green", [i+1]: "green"});
                    await delay(animationDelay);
                }
            }
        }
    }

    async function selectionSort(arr: number[]): Promise<void> {
        const len = arr.length;
        for (let i=0; i<len-1; i++) {
            if (!isSorting) return;
            let minIndex = i;
            drawArray(arr, {[i]: "red"});
            await delay(animationDelay);
            for (let j=i+1; j<len; j++) {
                if (!isSorting) return;
                drawArray(arr, {[i]: "red", [j]: "yellow", [minIndex]: "blue"});
                await delay(animationDelay);
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                drawArray(arr, {[i]: "green", [minIndex]: "green"});
                await delay(animationDelay);
            }
        }
    }

    async function insertionSort(arr: number[]): Promise<void> {
        const len = arr.length;
        for (let i=1; i<len; i++) {
            if (!isSorting) return;

            const key = arr[i];
            let j=i-1;
            drawArray(arr, {[i]: "yellow"});
            await delay(animationDelay);
            while (j >= 0 && arr[j] > key) {
                if (!isSorting) return;
                drawArray(arr, {[j]: "red", [j+1]: "yellow"});
                await delay(animationDelay);
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
            drawArray(arr, {[j+1]: "green"});
            await delay(animationDelay);
        }
    }

    async function quickSort(arr: number[], low: number = 0, high: number = arr.length - 1): Promise<void> {
        if (low<high) {
            if (!isSorting) return;
            const pivotIndex = await partition(arr, low, high);
            await quickSort(arr, low, pivotIndex - 1);
            await quickSort(arr, pivotIndex + 1, high);
        }
    }

    async function partition(arr: number[], low: number, high: number) {
        const pivot = arr[high];
        let i = low-1
        drawArray(arr, {[high]: "red"});
        await delay(animationDelay);
        for (let j = low; j< high; j++) {
            if (!isSorting) return high;
                drawArray(arr, {[high]: "red", [j]: "yellow", ...(i >= 0 ? {[i+1]: "blue"} : {})});
            await delay(animationDelay);
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                drawArray(arr, {[high]: "red", [i]: "green", [j]: "green"});
                await delay(animationDelay);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        drawArray(arr, {[i+1]: "purple", [high]: "purple"});
        await delay(animationDelay);
        return i+1;
    }

    async function mergeSort(arr: number[], left: number = 0, right: number = arr.length - 1): Promise<void> {
        if (left < right) {
            if (!isSorting) return;
            const mid = Math.floor((left + right) / 2);
            const colors: {[key: number]: string} = {};
            for (let i = left; i <= right; i++) {
                colors[i] = "yellow";
            }
            drawArray(arr, colors);
            await delay(animationDelay);
            await mergeSort(arr, left, mid);
            await mergeSort(arr, mid + 1, right);
            await merge(arr, left, mid, right);
        }
    }

    async function merge(arr: number[], left: number, mid: number, right: number): Promise<void> {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;
        const colors: {[key: number]: string} = {};
        for (let idx = left; idx <= mid; idx++) colors[idx] = "blue";
        for (let idx = mid + 1; idx <= right; idx++) colors[idx] = "red";
        drawArray(arr, colors);
        await delay(animationDelay);
        while (i < leftArr.length && j < rightArr.length) {
            if (!isSorting) return;
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            drawArray(arr, {[k]: "green"});
            await delay(animationDelay);
            k++;
        }
        while (i < leftArr.length) {
            if (!isSorting) return;
            arr[k] = leftArr[i];
            drawArray(arr, {[k]: "green"});
            await delay(animationDelay);
            i++;
            k++;
        }
        while (j < rightArr.length) {
            if (!isSorting) return;
            arr[k] = rightArr[j];
            drawArray(arr, {[k]: "green"});
            await delay(animationDelay);
            j++;
            k++;
        }
    }

    async function heapSort(arr: number[]): Promise<void> {
        const len = arr.length;
        for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
            await heapify(arr, len, i);
        }
        for (let i = len - 1; i > 0; i--) {
            if (!isSorting) return;
            [arr[0], arr[i]] = [arr[i], arr[0]];
            drawArray(arr, {[0]: "red", [i]: "green"});
            await delay(animationDelay);
            await heapify(arr, i, 0);
        }
    }

    async function heapify(arr: number[], n: number, i: number): Promise<void> {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        drawArray(arr, {[i]: "yellow"});
        await delay(animationDelay / 2);
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }
        if (largest !== i) {
            if (!isSorting) return;
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            drawArray(arr, {[i]: "red", [largest]: "red"});
            await delay(animationDelay);
            await heapify(arr, n, largest);
        }
    }

    async function cocktailShakerSort(arr: number[]): Promise<void> {
        let start = 0;
        let end = arr.length - 1;
        let swapped = true;
        
        while (swapped) {
            if (!isSorting) return;
            swapped = false;
            for (let i = start; i < end; i++) {
                if (!isSorting) return;
                drawArray(arr, {[i]: "yellow", [i+1]: "yellow"});
                await delay(animationDelay);
                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    swapped = true;
                    drawArray(arr, {[i]: "green", [i+1]: "green"});
                    await delay(animationDelay);
                }
            }
            if (!swapped) break;
            end--;
            for (let i = end; i > start; i--) {
                if (!isSorting) return;
                drawArray(arr, {[i]: "blue", [i-1]: "blue"});
                await delay(animationDelay);
                if (arr[i] < arr[i - 1]) {
                    [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                    swapped = true;
                    drawArray(arr, {[i]: "green", [i-1]: "green"});
                    await delay(animationDelay);
                }
            }
            start++;
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
            if (algorithm === "bubble") {
                await bubbleSort(array);
            } else if (algorithm == "selection") {
                await selectionSort(array);
            } else if (algorithm == "insertion") {
                await insertionSort(array);
            } else if (algorithm == "quick") {
                await quickSort(array);
            } else if (algorithm == "merge") {
                await mergeSort(array);
            } else if (algorithm == "heap") {
                await heapSort(array);
            } else if (algorithm == "cocktail-shaker") {
                await cocktailShakerSort(array);
            } 

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
