"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    // The array to be sorted
    let array = [];
    // References to the HTML elements
    const canvas = document.getElementById("visualisation-canvas");
    const ctx = canvas.getContext("2d");
    const generateBtn = document.getElementById("generate-array");
    const sortBtn = document.getElementById("sort");
    const speedSlider = document.getElementById("speed");
    const arraySizeSlider = document.getElementById("array-size");
    let animationDelay = 10;
    let isSorting = false;
    function generateRandomArray(size = 50) {
        const arr = [];
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
    function drawArray(arr, highlights = {}) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
        const barWidth = canvas.width / arr.length;
        for (let i = 0; i < arr.length; i++) {
            if (i < 0 || i >= arr.length) {
                continue;
            }
            const value = arr[i];
            if (value === undefined) {
                continue;
            }
            const barHeight = (value / 100) * canvas.height;
            const x = i * barWidth;
            ctx.fillStyle = highlights[i] || "steelblue";
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        }
    }
    function bubbleSort(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const len = arr.length;
            for (let pass = 0; pass < len; pass++) {
                for (let i = 0; i < len - pass - 1; i++) {
                    if (!isSorting)
                        return;
                    if (i + 1 >= arr.length) {
                        break; // Exit the inner loop if out of bounds
                    }
                    const valueI = arr[i];
                    const valueIPlus1 = arr[i + 1];
                    if (valueI === undefined || valueIPlus1 === undefined) {
                        continue; // Skip this comparison if either is missing
                    }
                    // Show the 2 bars being compared
                    drawArray(arr, { [i]: "green", [i + 1]: "green" });
                    yield delay(animationDelay);
                    if (valueI > valueIPlus1) {
                        [arr[i], arr[i + 1]] = [valueIPlus1, valueI];
                        drawArray(arr, { [i]: "green", [i + 1]: "green" });
                        yield delay(animationDelay);
                    }
                }
            }
        });
    }
    function selectionSort(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const len = arr.length;
            for (let i = 0; i < len - 1; i++) {
                if (!isSorting)
                    return;
                let minIndex = i;
                drawArray(arr, { [i]: "red" });
                yield delay(animationDelay);
                for (let j = i + 1; j < len; j++) {
                    if (!isSorting)
                        return;
                    drawArray(arr, { [i]: "red", [j]: "yellow", [minIndex]: "blue" });
                    yield delay(animationDelay);
                    if (arr[j] < arr[minIndex]) {
                        minIndex = j;
                    }
                }
                if (minIndex !== i) {
                    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                    drawArray(arr, { [i]: "green", [minIndex]: "green" });
                    yield delay(animationDelay);
                }
            }
        });
    }
    function insertionSort(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const len = arr.length;
            for (let i = 1; i < len; i++) {
                if (!isSorting)
                    return;
                const key = arr[i];
                let j = i - 1;
                drawArray(arr, { [i]: "yellow" });
                yield delay(animationDelay);
                while (j >= 0 && arr[j] > key) {
                    if (!isSorting)
                        return;
                    drawArray(arr, { [j]: "red", [j + 1]: "yellow" });
                    yield delay(animationDelay);
                    arr[j + 1] = arr[j];
                    j--;
                }
                arr[j + 1] = key;
                drawArray(arr, { [j + 1]: "green" });
                yield delay(animationDelay);
            }
        });
    }
    function quickSort(arr_1) {
        return __awaiter(this, arguments, void 0, function* (arr, low = 0, high = arr.length - 1) {
            if (low < high) {
                if (!isSorting)
                    return;
                const pivotIndex = yield partition(arr, low, high);
                yield quickSort(arr, low, pivotIndex - 1);
                yield quickSort(arr, pivotIndex + 1, high);
            }
        });
    }
    function partition(arr, low, high) {
        return __awaiter(this, void 0, void 0, function* () {
            const pivot = arr[high];
            let i = low - 1;
            drawArray(arr, { [high]: "red" });
            yield delay(animationDelay);
            for (let j = low; j < high; j++) {
                if (!isSorting)
                    return high;
                drawArray(arr, Object.assign({ [high]: "red", [j]: "yellow" }, (i >= 0 ? { [i + 1]: "blue" } : {})));
                yield delay(animationDelay);
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    drawArray(arr, { [high]: "red", [i]: "green", [j]: "green" });
                    yield delay(animationDelay);
                }
            }
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            drawArray(arr, { [i + 1]: "purple", [high]: "purple" });
            yield delay(animationDelay);
            return i + 1;
        });
    }
    function mergeSort(arr_1) {
        return __awaiter(this, arguments, void 0, function* (arr, left = 0, right = arr.length - 1) {
            if (left < right) {
                if (!isSorting)
                    return;
                const mid = Math.floor((left + right) / 2);
                const colors = {};
                for (let i = left; i <= right; i++) {
                    colors[i] = "yellow";
                }
                drawArray(arr, colors);
                yield delay(animationDelay);
                yield mergeSort(arr, left, mid);
                yield mergeSort(arr, mid + 1, right);
                yield merge(arr, left, mid, right);
            }
        });
    }
    function merge(arr, left, mid, right) {
        return __awaiter(this, void 0, void 0, function* () {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);
            let i = 0, j = 0, k = left;
            const colors = {};
            for (let idx = left; idx <= mid; idx++)
                colors[idx] = "blue";
            for (let idx = mid + 1; idx <= right; idx++)
                colors[idx] = "red";
            drawArray(arr, colors);
            yield delay(animationDelay);
            while (i < leftArr.length && j < rightArr.length) {
                if (!isSorting)
                    return;
                if (leftArr[i] <= rightArr[j]) {
                    arr[k] = leftArr[i];
                    i++;
                }
                else {
                    arr[k] = rightArr[j];
                    j++;
                }
                drawArray(arr, { [k]: "green" });
                yield delay(animationDelay);
                k++;
            }
            while (i < leftArr.length) {
                if (!isSorting)
                    return;
                arr[k] = leftArr[i];
                drawArray(arr, { [k]: "green" });
                yield delay(animationDelay);
                i++;
                k++;
            }
            while (j < rightArr.length) {
                if (!isSorting)
                    return;
                arr[k] = rightArr[j];
                drawArray(arr, { [k]: "green" });
                yield delay(animationDelay);
                j++;
                k++;
            }
        });
    }
    function heapSort(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const len = arr.length;
            for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
                yield heapify(arr, len, i);
            }
            for (let i = len - 1; i > 0; i--) {
                if (!isSorting)
                    return;
                [arr[0], arr[i]] = [arr[i], arr[0]];
                drawArray(arr, { [0]: "red", [i]: "green" });
                yield delay(animationDelay);
                yield heapify(arr, i, 0);
            }
        });
    }
    function heapify(arr, n, i) {
        return __awaiter(this, void 0, void 0, function* () {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            drawArray(arr, { [i]: "yellow" });
            yield delay(animationDelay / 2);
            if (left < n && arr[left] > arr[largest]) {
                largest = left;
            }
            if (right < n && arr[right] > arr[largest]) {
                largest = right;
            }
            if (largest !== i) {
                if (!isSorting)
                    return;
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                drawArray(arr, { [i]: "red", [largest]: "red" });
                yield delay(animationDelay);
                yield heapify(arr, n, largest);
            }
        });
    }
    function cocktailShakerSort(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            let start = 0;
            let end = arr.length - 1;
            let swapped = true;
            while (swapped) {
                if (!isSorting)
                    return;
                swapped = false;
                for (let i = start; i < end; i++) {
                    if (!isSorting)
                        return;
                    drawArray(arr, { [i]: "yellow", [i + 1]: "yellow" });
                    yield delay(animationDelay);
                    if (arr[i] > arr[i + 1]) {
                        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                        swapped = true;
                        drawArray(arr, { [i]: "green", [i + 1]: "green" });
                        yield delay(animationDelay);
                    }
                }
                if (!swapped)
                    break;
                end--;
                for (let i = end; i > start; i--) {
                    if (!isSorting)
                        return;
                    drawArray(arr, { [i]: "blue", [i - 1]: "blue" });
                    yield delay(animationDelay);
                    if (arr[i] < arr[i - 1]) {
                        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                        swapped = true;
                        drawArray(arr, { [i]: "green", [i - 1]: "green" });
                        yield delay(animationDelay);
                    }
                }
                start++;
            }
        });
    }
    // Helper function to make the delay code cleaner
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function updateSpeed() {
        // Convert slider value to delay (higher slider = faster = lower delay)
        animationDelay = 200 - (parseInt(speedSlider.value) * 1.9);
    }
    function init() {
        updateSpeed();
        const initialSize = parseInt(arraySizeSlider.value);
        array = generateRandomArray(initialSize);
        drawArray(array);
        // Event Listeners
        generateBtn.addEventListener("click", () => {
            if (isSorting)
                return;
            const size = parseInt(arraySizeSlider.value);
            array = generateRandomArray(size);
            drawArray(array);
        });
        speedSlider.addEventListener("input", updateSpeed);
        arraySizeSlider.addEventListener("input", () => {
            if (isSorting)
                return;
            const size = parseInt(arraySizeSlider.value);
            array = generateRandomArray(size);
            drawArray(array);
        });
        sortBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            // Disable the buttons while sorting
            isSorting = true;
            generateBtn.disabled = true;
            sortBtn.disabled = true;
            // Get the selected algorithm
            const algorithm = document.getElementById("algorithm-selector").value;
            // Run the chosen algorithm
            if (algorithm === "bubble") {
                yield bubbleSort(array);
            }
            else if (algorithm == "selection") {
                yield selectionSort(array);
            }
            else if (algorithm == "insertion") {
                yield insertionSort(array);
            }
            else if (algorithm == "quick") {
                yield quickSort(array);
            }
            else if (algorithm == "merge") {
                yield mergeSort(array);
            }
            else if (algorithm == "heap") {
                yield heapSort(array);
            }
            else if (algorithm == "cocktail-shaker") {
                yield cocktailShakerSort(array);
            }
            // Re-enable buttons when done
            isSorting = false;
            generateBtn.disabled = false;
            sortBtn.disabled = false;
            // Draw the final, sorted array
            drawArray(array);
        }));
    }
    // Start the app
    init();
})();
