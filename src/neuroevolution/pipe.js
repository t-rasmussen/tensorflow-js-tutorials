// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

class Pipe {
    constructor(p5) {
      this.p5 = p5;
      // How big is the empty space
      let spacing = 125;
      // Where is th center of the empty space
      let centery = p5.random(spacing, p5.height - spacing);
  
      // Top and bottom of pipe
      this.top = centery - spacing / 2;
      this.bottom = p5.height - (centery + spacing / 2);
      // Starts at the edge
      this.x = p5.width;
      // Width of pipe
      this.w = 80;
      // How fast
      this.speed = 6;
    }
  
    // Did this pipe hit a bird?
    hits(bird) {
      if (bird.y - bird.r < this.top || bird.y + bird.r > this.p5.height - this.bottom) {
        if (bird.x > this.x && bird.x < this.x + this.w) {
          return true;
        }
      }
      return false;
    }
  
    // Draw the pipe
    show() {
      this.p5.stroke(255);
      this.p5.fill(200);
      this.p5.rect(this.x, 0, this.w, this.top);
      this.p5.rect(this.x, this.p5.height - this.bottom, this.w, this.bottom);
    }
  
    // Update the pipe
    update() {
      this.x -= this.speed;
    }
  
    // Has it moved offscreen?
    offscreen() {
      if (this.x < -this.w) {
        return true;
      } else {
        return false;
      }
    }
  }

  export default Pipe;