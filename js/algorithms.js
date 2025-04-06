// Bubble Sort
async function bubbleSort(array, updateVisual, speed) {
    const n = array.length;
    let swapped;
    let comparisons = 0;
    let swaps = 0;
    
    for (let i = 0; i < n; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Compare elements
            await updateVisual({ type: 'compare', indices: [j, j + 1] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapped = true;
                await updateVisual({ type: 'swap', indices: [j, j + 1] }, array, comparisons, ++swaps);
                await sleep(speed);
            }
        }
        
        // Mark the last element as sorted
        await updateVisual({ type: 'sorted', index: n - i - 1 }, array, comparisons, swaps);
        await sleep(speed);
        
        if (!swapped) break;
    }
    
    // Mark all remaining elements as sorted
    for (let i = 0; i < n; i++) {
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed / 10); // Faster for final marking
    }
    
    return { comparisons, swaps };
}

// Insertion Sort
async function insertionSort(array, updateVisual, speed) {
    const n = array.length;
    let comparisons = 0;
    let swaps = 0;
    
    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;
        
        await updateVisual({ type: 'compare', indices: [i, j] }, array, ++comparisons, swaps);
        await sleep(speed);
        
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            await updateVisual({ type: 'swap', indices: [j, j + 1] }, array, comparisons, ++swaps);
            await sleep(speed);
            
            j--;
            
            if (j >= 0) {
                await updateVisual({ type: 'compare', indices: [i, j] }, array, ++comparisons, swaps);
                await sleep(speed);
            }
        }
        
        array[j + 1] = key;
    }
    
    // Mark all elements as sorted
    for (let i = 0; i < n; i++) {
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed / 10);
    }
    
    return { comparisons, swaps };
}

// Selection Sort
async function selectionSort(array, updateVisual, speed) {
    const n = array.length;
    let comparisons = 0;
    let swaps = 0;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
            await updateVisual({ type: 'compare', indices: [minIndex, j] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            // Swap elements
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            await updateVisual({ type: 'swap', indices: [i, minIndex] }, array, comparisons, ++swaps);
            await sleep(speed);
        }
        
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed);
    }
    
    await updateVisual({ type: 'sorted', index: n - 1 }, array, comparisons, swaps);
    await sleep(speed);
    
    return { comparisons, swaps };
}

// Merge Sort
async function mergeSort(array, updateVisual, speed) {
    let comparisons = 0;
    let swaps = 0;
    const tempArray = [...array];
    
    async function mergeSortHelper(start, end) {
        if (start >= end) return;
        
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(start, mid);
        await mergeSortHelper(mid + 1, end);
        await merge(start, mid, end);
    }
    
    async function merge(start, mid, end) {
        const leftArray = array.slice(start, mid + 1);
        const rightArray = array.slice(mid + 1, end + 1);
        
        let i = 0, j = 0, k = start;
        
        while (i < leftArray.length && j < rightArray.length) {
            await updateVisual({ type: 'compare', indices: [start + i, mid + 1 + j] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            
            await updateVisual({ type: 'overwrite', index: k, value: array[k] }, array, comparisons, ++swaps);
            await sleep(speed);
            
            k++;
        }
        
        while (i < leftArray.length) {
            array[k] = leftArray[i];
            await updateVisual({ type: 'overwrite', index: k, value: array[k] }, array, comparisons, ++swaps);
            await sleep(speed);
            i++;
            k++;
        }
        
        while (j < rightArray.length) {
            array[k] = rightArray[j];
            await updateVisual({ type: 'overwrite', index: k, value: array[k] }, array, comparisons, ++swaps);
            await sleep(speed);
            j++;
            k++;
        }
    }
    
    await mergeSortHelper(0, array.length - 1);
    
    for (let i = 0; i < array.length; i++) {
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed / 10);
    }
    
    return { comparisons, swaps };
}

// Quick Sort
async function quickSort(array, updateVisual, speed) {
    let comparisons = 0;
    let swaps = 0;
    
    async function quickSortHelper(low, high) {
        if (low < high) {
            const pivotIndex = await partition(low, high);
            await quickSortHelper(low, pivotIndex - 1);
            await quickSortHelper(pivotIndex + 1, high);
        } else if (low >= 0 && high >= 0 && low < array.length && high < array.length) {
            await updateVisual({ type: 'sorted', index: low }, array, comparisons, swaps);
            await sleep(speed);
        }
    }
    
    async function partition(low, high) {
        const pivot = array[high];
        await updateVisual({ type: 'pivot', index: high }, array, comparisons, swaps);
        await sleep(speed);
        
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            await updateVisual({ type: 'compare', indices: [j, high] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (array[j] <= pivot) {
                i++;
                
                [array[i], array[j]] = [array[j], array[i]];
                await updateVisual({ type: 'swap', indices: [i, j] }, array, comparisons, ++swaps);
                await sleep(speed);
            }
        }
        
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        await updateVisual({ type: 'swap', indices: [i + 1, high] }, array, comparisons, ++swaps);
        await sleep(speed);
        
        await updateVisual({ type: 'sorted', index: i + 1 }, array, comparisons, swaps);
        await sleep(speed);
        
        return i + 1;
    }
    
    await quickSortHelper(0, array.length - 1);
    
    for (let i = 0; i < array.length; i++) {
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed / 10);
    }
    
    return { comparisons, swaps };
}

// Heap Sort
async function heapSort(array, updateVisual, speed) {
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;
    
    async function heapify(n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < n) {
            await updateVisual({ type: 'compare', indices: [largest, left] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (array[left] > array[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            await updateVisual({ type: 'compare', indices: [largest, right] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (array[right] > array[largest]) {
                largest = right;
            }
        }
        
        if (largest !== i) {
            [array[i], array[largest]] = [array[largest], array[i]];
            await updateVisual({ type: 'swap', indices: [i, largest] }, array, comparisons, ++swaps);
            await sleep(speed);
            
            await heapify(n, largest);
        }
    }
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        await updateVisual({ type: 'swap', indices: [0, i] }, array, comparisons, ++swaps);
        await sleep(speed);
        
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed);
        
        await heapify(i, 0);
    }
    
    await updateVisual({ type: 'sorted', index: 0 }, array, comparisons, swaps);
    await sleep(speed);
    
    return { comparisons, swaps };
}

// Radix Sort
async function radixSort(array, updateVisual, speed) {
    let comparisons = 0;
    let swaps = 0;
    
    let max = Math.max(...array);
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSortForRadix(exp);
    }
    
    async function countingSortForRadix(exp) {
        const n = array.length;
        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);
        
        for (let i = 0; i < n; i++) {
            const digit = Math.floor(array[i] / exp) % 10;
            count[digit]++;
            await updateVisual({ type: 'compare', indices: [i, i] }, array, ++comparisons, swaps);
            await sleep(speed);
        }
        
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        for (let i = n - 1; i >= 0; i--) {
            const digit = Math.floor(array[i] / exp) % 10;
            output[count[digit] - 1] = array[i];
            count[digit]--;
            swaps++;
        }
        
        for (let i = 0; i < n; i++) {
            array[i] = output[i];
            await updateVisual({ type: 'overwrite', index: i, value: array[i] }, array, comparisons, swaps);
            await sleep(speed);
        }
    }
    
    for (let i = 0; i < array.length; i++) {
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed / 10);
    }
    
    return { comparisons, swaps };
}

// Counting Sort
async function countingSort(array, updateVisual, speed) {
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;
    
    let max = Math.max(...array);
    let min = Math.min(...array);
    
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
        count[array[i] - min]++;
        await updateVisual({ type: 'compare', indices: [i, i] }, array, ++comparisons, swaps);
        await sleep(speed);
    }
    
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    for (let i = n - 1; i >= 0; i--) {
        output[count[array[i] - min] - 1] = array[i];
        count[array[i] - min]--;
        swaps++;
    }
    
    for (let i = 0; i < n; i++) {
        array[i] = output[i];
        await updateVisual({ type: 'overwrite', index: i, value: array[i] }, array, comparisons, swaps);
        await sleep(speed);
    }
    
    for (let i = 0; i < n; i++) {
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed / 10);
    }
    
    return { comparisons, swaps };
}

// Cocktail Sort
async function cocktailSort(array, updateVisual, speed) {
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;
    
    let swapped = true;
    let start = 0;
    let end = n - 1;
    
    while (swapped) {
        swapped = false;
        
        for (let i = start; i < end; i++) {
            await updateVisual({ type: 'compare', indices: [i, i + 1] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapped = true;
                await updateVisual({ type: 'swap', indices: [i, i + 1] }, array, comparisons, ++swaps);
                await sleep(speed);
            }
        }
        
        if (!swapped) break;
        
        await updateVisual({ type: 'sorted', index: end }, array, comparisons, swaps);
        await sleep(speed);
        
        end--;
        
        swapped = false;
        
        for (let i = end; i >= start; i--) {
            await updateVisual({ type: 'compare', indices: [i, i + 1] }, array, ++comparisons, swaps);
            await sleep(speed);
            
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapped = true;
                await updateVisual({ type: 'swap', indices: [i, i + 1] }, array, comparisons, ++swaps);
                await sleep(speed);
            }
        }
        
        await updateVisual({ type: 'sorted', index: start }, array, comparisons, swaps);
        await sleep(speed);
        start++;
    }
    
    for (let i = 0; i < n; i++) {
        await updateVisual({ type: 'sorted', index: i }, array, comparisons, swaps);
        await sleep(speed / 10);
    }
    
    return { comparisons, swaps };
}
