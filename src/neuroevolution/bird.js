// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

import NeuralNetwork from './nn.js';

class Bird {
    constructor(brain, p5) {
      this.p5 = p5;
      // position and size of bird
      this.x = 64;
      this.y = p5.height / 2;
      this.r = 12;
  
      // Gravity, lift and velocity
      this.gravity = 0.8;
      this.lift = -12;
      this.velocity = 0;
  
      // Is this a copy of another Bird or a new one?
      // The Neural Network is the bird's "brain"
      if (brain instanceof NeuralNetwork) {
        this.brain = brain.copy();
        this.brain.mutate();
      } else {
        this.brain = new NeuralNetwork(null, p5);
      }
  
      // Score is how many frames it's been alive
      this.score = 0;
      // Fitness is normalized version of score
      this.fitness = 0;
    }
  
    // Create a copy of this bird
    copy() {
      return new Bird(this.brain, this.p5);
    }
  
    dispose() {
      if(this.brain){
        this.brain.dispose();
      }
    }
  
    // Display the bird
    show() {
      this.p5.fill(255, 100);
      this.p5.stroke(255);
      this.p5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
  
    save() {
      this.brain.save();
    }
  
    // This is the key function now that decides
    // if it should jump or not jump!
    think(pipes) {
      // First find the closest pipe
      let closest = null;
      let record = Infinity;
      for (let i = 0; i < pipes.length; i++) {
        let diff = pipes[i].x - this.x;
        if (diff > 0 && diff < record) {
          record = diff;
          closest = pipes[i];
        }
      }
  
      if (closest != null) {
        // Now create the inputs to the neural network
        let inputs = [];
        // x position of closest pipe
        inputs[0] = this.p5.map(closest.x, this.x, this.p5.width, 0, 1);
        // top of closest pipe opening
        inputs[1] = this.p5.map(closest.top, 0, this.p5.height, 0, 1);
        // bottom of closest pipe opening
        inputs[2] = this.p5.map(closest.bottom, 0, this.p5.height, 0, 1);
        // bird's y position
        inputs[3] = this.p5.map(this.y, 0, this.p5.height, 0, 1);
        // bird's y velocity
        inputs[4] = this.p5.map(this.velocity, -5, 5, 0, 1);
  
        // Get the outputs from the network
        let action = this.brain.predict(inputs);
        // Decide to jump or not!
        if (action[1] > action[0]) {
          this.up();
        }
      }
    }
  
    // Jump up
    up() {
      this.velocity += this.lift;
    }
  
    bottomTop() {
      // Bird dies when hits bottom?
      return this.y > this.p5.height || this.y < 0;
    }
  
    // Update bird's position based on velocity, gravity, etc.
    update() {
      this.velocity += this.gravity;
      // this.velocity *= 0.9;
      this.y += this.velocity;
  
      // Every frame it is alive increases the score
      this.score++;
    }
  }

  export default Bird;