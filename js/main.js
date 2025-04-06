document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new Visualizer();
    visualizer.initialize([]);

    const generateArrayBtn = document.getElementById('generate-array');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const algorithmSelect = document.getElementById('algorithm-select');
    const speedSlider = document.getElementById('speed-slider');
    const themeSwitch = document.getElementById('theme-switch');
    const arrayInput = document.getElementById('array-input');

    generateArrayBtn.addEventListener('click', () => {
        if (visualizer.isSorting) return;

        const size = Math.floor(Math.random() * 11) + 10; // Random size between 10-20
        const randomArray = generateRandomArray(size, 5, 100);
        visualizer.initialize(randomArray);
    });


    startBtn.addEventListener('click', () => {
        if (visualizer.array.length === 0 && arrayInput.value.trim() !== '') {
            visualizer.createFromInput(arrayInput.value);
        }

        visualizer.startSorting();
    });

    resetBtn.addEventListener('click', () => {
        visualizer.reset();
        arrayInput.value = ''; // Clear input field
    });

    // Algorithm selection change
    algorithmSelect.addEventListener('change', () => {
        visualizer.updateComplexityInfo();
    });

    // Speed slider change
    speedSlider.addEventListener('input', () => {
        updateSpeedText(parseInt(speedSlider.value));
        visualizer.updateSpeed(parseInt(speedSlider.value));
    });

    updateSpeedText(parseInt(speedSlider.value));

    arrayInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            visualizer.createFromInput(arrayInput.value);
        }
    });

    themeSwitch.addEventListener('change', () => {
        toggleTheme();
    });
});
