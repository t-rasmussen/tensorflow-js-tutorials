// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

// This file includes functions for creating a new generation
// of birds.

class GenerativeAlgorithm{

    constructor(p5){
        this.p5 = p5;
    }

// Start the game over
  resetGame() {
    counter = 0;
    // Resetting best bird score to 0
    if (bestBird) {
      bestBird.score = 0;
    }
    pipes = [];
 }
  
  // Create the next generation
  nextGeneration() {
    this.resetGame();
    // Normalize the fitness values 0-1
    this.normalizeFitness(allBirds);
    // Generate a new set of birds
    activeBirds = this.generate(allBirds);
  
    // dispose of old birds
    for (let bird of allBirds) {
      if (bird !== bestBird) {
        bird.dispose();
      }
    }
  
    // Copy those birds to another array
    allBirds = activeBirds.slice();
  }
  
  // Generate a new population of birds
  generate(oldBirds) {
    let newBirds = [];
    for (let i = 0; i < oldBirds.length; i++) {
      // Select a bird based on fitness
      let bird = this.poolSelection(oldBirds);
      newBirds[i] = bird;
    }
    return newBirds;
  }
  
  // Normalize the fitness of all birds
  normalizeFitness(birds) {
    // Make score exponentially better?
    for (let i = 0; i < birds.length; i++) {
      birds[i].score = pow(birds[i].score, 2);
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
  poolSelection(birds) {
    // Start at 0
    let index = 0;
  
    // Pick a random number between 0 and 1
    let r = this.random(1);
  
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