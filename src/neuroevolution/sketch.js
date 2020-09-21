import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import Bird from './bird.js';
import Pipe from './pipe.js';


console.log("hello smart flappy bird"); 

const sketch = (p5) => {
    
    //all birds for a given population
    let allBirds = [];
    //active virds for a given population
    let activeBirds = [];
    //best bird
    let bestBird;
    //all pipes
    let pipes = [];
    //size of population
    let totalPopulation = 200;
    //counter which is also the score and decied when to add a pipe
    let counter = 0;

    // Interface elements
    let speedSlider;
    let speedSpan;
    let highScoreSpan;
    let allTimeHighScoreSpan;

    // All time high score
    let highScore = 0;

    // Training or just showing the current best
    let runBest = false;
    let runBestButton;
    let saveButton;

    let canvas;
    

    
    p5.setup = () => {
        canvas = p5.createCanvas(800, 600);
        canvas.parent('canvascontainer');
        // Access the interface elements
        speedSlider = p5.select('#speedSlider');
        speedSpan = p5.select('#speed');
        highScoreSpan = p5.select('#hs');
        allTimeHighScoreSpan = p5.select('#ahs');
        runBestButton = p5.select('#best');
        runBestButton.mousePressed(toggleState);

        saveButton = p5.select('#save');
        saveButton.mousePressed(saveModel);

        //create population of birds
        for(let i = 0; i < totalPopulation; i++){
            let bird = new Bird(null, p5);
            allBirds[i] = bird;
            activeBirds[i] = bird;
        }
    }

    function saveModel() {
        if(bestBird){
            bestBird.save();
        }
    }
      
      // Toggle the state of the simulation
    function toggleState() {
        runBest = !runBest;
        // Show the best bird
        if (runBest) {
          resetGame();
          runBestButton.html('continue training');
          // Go train some more
        } else {
          nextGeneration();
          runBestButton.html('run best');
        }
    }

    p5.draw = () => {
        p5.clear();
        p5.background(p5.color(50, 50, 50));


        // Should we speed up cycles per frame
        let cycles = speedSlider.value();
        speedSpan.html(cycles);

        for(let n = 0; n < cycles; n++){
            //update position of pipes
            //remove the pipes that have moved outside of the screen
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].update();
                if (pipes[i].offscreen()) {
                    pipes.splice(i, 1);
                }
            }

            //update position of active birds and remove the ones that hit a pipe or the bottom
            for (let i = activeBirds.length - 1; i >= 0; i--) {
                let bird = activeBirds[i];
                // Bird uses its brain!
                bird.think(pipes);
                bird.update();
        
                // Check all the pipes
                for (let j = 0; j < pipes.length; j++) {
                    // It's hit a pipe
                    if (pipes[j].hits(activeBirds[i])) {
                        // Remove this bird
                        activeBirds.splice(i, 1);
                        break;
                    }
                }
        
                if (bird.bottomTop()) {
                    activeBirds.splice(i, 1);
                }
            }

            //create a new pipe every 75 count
            if(counter % 75 == 0){
                pipes.push(new Pipe(p5));
            }

            counter++;
        }

        // What is highest score of the current population
        let tempHighScore = 0;
        // If we're training
        if (!runBest) {
            // Which is the best bird?
            let tempBestBird = null;
            for (let i = 0; i < activeBirds.length; i++) {
                let s = activeBirds[i].score;
                if (s > tempHighScore) {
                    tempHighScore = s;
                    tempBestBird = activeBirds[i];
                }
            }

            // Is it the all time high scorer?
            if (tempHighScore > highScore) {
                highScore = tempHighScore;
                bestBird = tempBestBird;
            }
        } 

        // Update DOM Elements
        highScoreSpan.html(tempHighScore);
        allTimeHighScoreSpan.html(highScore);

        // Draw everything!
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].show();
        }
        for (let i = 0; i < activeBirds.length; i++) {
            activeBirds[i].show();
        }

        //create next generation of birds, when all active birds have died
        if (activeBirds.length == 0) {
            nextGeneration();
        }

    }

    // Start the game over
    function resetGame() {
        counter = 0;
        // Resetting best bird score to 0
        if (bestBird) {
            bestBird.score = 0;
        }
        pipes = [];
    }
    
    // Create the next generation
    function nextGeneration() {
        resetGame();
        // Normalize the fitness values 0-1
        normalizeFitness(allBirds);
        // Generate a new set of birds
        activeBirds = generate(allBirds);
    
        // dispose of old birds
        for (let bird of allBirds) {
            if (bird !== bestBird) {
                bird.dispose();
            }
        }
    
        // Copy those new active birds all birds array
        allBirds = activeBirds.slice();
    }
    
    // Generate a new population of birds
    function generate(oldBirds) {
        let newBirds = [];
        for (let i = 0; i < oldBirds.length; i++) {
            // Select a bird based on fitness
            let bird = poolSelection(oldBirds);
            newBirds[i] = bird;
        }
        return newBirds;
    }
    
    // Normalize the fitness of all birds
    function normalizeFitness(birds) {
        // Make score exponentially better?
        for (let i = 0; i < birds.length; i++) {
        birds[i].score = p5.pow(birds[i].score, 2);
        }
    
        // Add up all the scores
        let sum = 0;
        for (let i = 0; i < birds.length; i++) {
        sum += birds[i].score;
        }
        // Divide by the sum
        for (let i = 0; i < birds.length; i++) {
        birds[i].fitness = birds[i].score / sum;
        }
    }
    
    // An algorithm for picking one bird from an array
    // based on fitness
    function poolSelection(birds) {
        // Start at 0
        let index = 0;
    
        // Pick a random number between 0 and 1
        let r = p5.random(1);
    
        // Keep subtracting probabilities until you get less than zero
        // Higher probabilities will be more likely to be fixed since they will
        // subtract a larger number towards zero
        while (r > 0) {
        r -= birds[index].fitness;
        // And move on to the next
        index += 1;
        }
    
        // Go back one
        index -= 1;
    
        // Make sure it's a copy!
        // (this includes mutation)
        return birds[index].copy();
    }
} 

new p5(sketch);