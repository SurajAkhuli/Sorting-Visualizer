class Visualizer {
    constructor() {
        this.array = [];
        this.barContainer = document.getElementById('bars-container');
        this.isSorting = false;
        this.comparisonsElement = document.getElementById('comparisons');
        this.swapsElement = document.getElementById('swaps');
        this.timeComplexityElement = document.getElementById('time-complexity');
        this.spaceComplexityElement = document.getElementById('space-complexity');
        this.stopRequested = false;
        this.animationSpeed = 50; // Default speed
    }
    
    initialize(array) {
        this.array = [...array];
        this.renderBars();
        this.resetStats();
        this.updateComplexityInfo();
    }
    
    renderBars() {
        this.barContainer.innerHTML = '';
        
        if (this.array.length === 0) {
            const message = document.createElement('div');
            message.className = 'empty-message';
            message.textContent = 'Generate an array or enter numbers to start';
            this.barContainer.appendChild(message);
            return;
        }
        
        const maxValue = Math.max(...this.array);
        const containerHeight = this.barContainer.clientHeight - 30; // Subtract for value text
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${(value / maxValue) * containerHeight}px`;
            bar.setAttribute('data-value', value);
            bar.setAttribute('data-index', index);
            
            const valueLabel = document.createElement('div');
            valueLabel.className = 'bar-value';
            valueLabel.textContent = value;
            bar.appendChild(valueLabel);
            
            this.barContainer.appendChild(bar);
        });
    }
    
    resetStats() {
        this.comparisonsElement.textContent = '0';
        this.swapsElement.textContent = '0';
    }
    
    updateComplexityInfo() {
        const algorithm = document.getElementById('algorithm-select').value;
        const complexity = getAlgorithmComplexity(algorithm);
        
        this.timeComplexityElement.textContent = complexity.time;
        this.spaceComplexityElement.textContent = complexity.space;
    }
    
    updateSpeed(sliderValue) {
        this.animationSpeed = sliderValue;
    }
    
    stopSorting() {
        this.stopRequested = true;
    }
    
    async updateVisual(animation, array, comparisons, swaps) {
        if (this.stopRequested) return;
        
        const bars = this.barContainer.querySelectorAll('.bar');
        
        this.comparisonsElement.textContent = comparisons;
        this.swapsElement.textContent = swaps;
        
        bars.forEach(bar => {
            bar.classList.remove('comparing', 'sorted', 'pivot');
        });
        
        if (animation.type === 'compare') {
            animation.indices.forEach(index => {
                if (index >= 0 && index < bars.length) {
                    bars[index].classList.add('comparing');
                }
            });
        } 
        else if (animation.type === 'swap') {
            const [i, j] = animation.indices;
            
            if (i >= 0 && i < bars.length && j >= 0 && j < bars.length) {
                const bar1 = bars[i];
                const bar2 = bars[j];
                
                bar1.classList.add('comparing');
                bar2.classList.add('comparing');
                
                bar1.style.transform = 'translateY(-20px)';
                bar2.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    const tempHeight = bar1.style.height;
                    const tempValue = bar1.getAttribute('data-value');
                    const tempValueLabel = bar1.querySelector('.bar-value').textContent;
                    
                    bar1.style.height = bar2.style.height;
                    bar1.setAttribute('data-value', bar2.getAttribute('data-value'));
                    bar1.querySelector('.bar-value').textContent = bar2.querySelector('.bar-value').textContent;
                    
                    bar2.style.height = tempHeight;
                    bar2.setAttribute('data-value', tempValue);
                    bar2.querySelector('.bar-value').textContent = tempValueLabel;
                    
                    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                    
                    setTimeout(() => {
                        bar1.style.transform = '';
                        bar2.style.transform = '';
                    }, 150);
                }, 150);
            }
        }
         
        else if (animation.type === 'sorted') {
            if (animation.index >= 0 && animation.index < bars.length) {
                bars[animation.index].classList.add('sorted');
            }
        } 
        else if (animation.type === 'pivot') {
            if (animation.index >= 0 && animation.index < bars.length) {
                bars[animation.index].classList.add('pivot');
            }
        } 
        else if (animation.type === 'overwrite') {
            if (animation.index >= 0 && animation.index < bars.length) {
                const maxValue = Math.max(...array);
                const containerHeight = this.barContainer.clientHeight - 30;
                
                bars[animation.index].style.height = `${(animation.value / maxValue) * containerHeight}px`;
                bars[animation.index].setAttribute('data-value', animation.value);
                bars[animation.index].querySelector('.bar-value').textContent = animation.value;
                bars[animation.index].classList.add('comparing');
                
                this.array[animation.index] = animation.value;
            }
        }
    }
    
    async startSorting() {
        if (this.isSorting || this.array.length === 0) return;
        
        this.isSorting = true;
        this.stopRequested = false;
        const algorithm = document.getElementById('algorithm-select').value;
        const speed = getAnimationSpeed(this.animationSpeed);
        
        const arrayCopy = [...this.array];
        
        try {
            let result;
            
            switch (algorithm) {
                case 'bubble':
                    result = await bubbleSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'insertion':
                    result = await insertionSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'selection':
                    result = await selectionSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'merge':
                    result = await mergeSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'quick':
                    result = await quickSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'heap':
                    result = await heapSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'radix':
                    result = await radixSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'counting':
                    result = await countingSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                case 'cocktail':
                    result = await cocktailSort(arrayCopy, this.updateVisual.bind(this), speed);
                    break;
                default:
                    console.error('Unknown algorithm:', algorithm);
            }
            
            if (!this.stopRequested) {
                this.array = arrayCopy;
                
                const bars = this.barContainer.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.classList.remove('comparing', 'pivot');
                    bar.classList.add('sorted');
                });
            }
            
        } catch (error) {
            console.error('Error during sorting:', error);
        } finally {
            this.isSorting = false;
            this.stopRequested = false;
        }
    }
    
    createFromInput(inputValue) {
        if (this.isSorting) return;
        
        const parsedArray = parseUserInput(inputValue);
        if (parsedArray.length > 0) {
            this.initialize(parsedArray);
            return true;
        }
        return false;
    }
    
    reset() {
        if (this.isSorting) {
            this.stopSorting();
        }
        this.initialize([]);
    }
}
