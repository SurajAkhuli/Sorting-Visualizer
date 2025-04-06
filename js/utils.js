function generateRandomArray(size = 20, min = 5, max = 100) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return array;
}


function parseUserInput(input) {
    return input.split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => parseInt(item))
        .filter(item => !isNaN(item));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getAnimationSpeed(sliderValue) {
    return Math.floor(1000 - ((sliderValue - 1) / 99) * 990);
}

function updateSpeedText(sliderValue) {
    const speedValue = document.getElementById('speed-value');
    if (sliderValue < 25) {
        speedValue.textContent = 'Slow';
    } else if (sliderValue < 75) {
        speedValue.textContent = 'Medium';
    } else {
        speedValue.textContent = 'Fast';
    }
}

function getAlgorithmComplexity(algorithm) {
    const complexities = {
        bubble: { time: 'O(n²)', space: 'O(1)' },
        insertion: { time: 'O(n²)', space: 'O(1)' },
        selection: { time: 'O(n²)', space: 'O(1)' },
        merge: { time: 'O(n log n)', space: 'O(n)' },
        quick: { time: 'O(n log n) - O(n²)', space: 'O(log n)' },
        heap: { time: 'O(n log n)', space: 'O(1)' },
        radix: { time: 'O(nk)', space: 'O(n+k)' },
        counting: { time: 'O(n+k)', space: 'O(k)' },
        cocktail: { time: 'O(n²)', space: 'O(1)' }
    };
    
    return complexities[algorithm] || { time: '-', space: '-' };
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}
