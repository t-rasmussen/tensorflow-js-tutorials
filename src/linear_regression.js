console.log("hello tensorflow");

import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';


const sketch = (p5) => {
   
    let x_vals = [];
    let y_vals = [];
    const radius = 5;

    let m, b;
    const learningRate = 0.1;
    const optimizer = tf.train.sgd(learningRate);


    p5.setup = () =>{
        p5.createCanvas(640, 480);

        m = tf.variable(tf.scalar(p5.random(1)));
        b = tf.variable(tf.scalar(p5.random(1)));  
    }

    p5.draw = () => {
        p5.clear();
        p5.background(p5.color(50, 50, 50));
        p5.stroke(255)
        p5.strokeWeight(4);

        let px, py;
        for(let i = 0; i < x_vals.length; i++){   
            px = p5.map(x_vals[i], 0, 1, 0, p5.width);
            py = p5.map(y_vals[i], 1, 0, 0, p5.height);        
            p5.ellipse(px, py, radius, radius);
        }

        tf.tidy(() => {
            if(x_vals.length > 1){
                //training
                optimizer.minimize(() => {
                    const xs = tf.tensor1d(x_vals);
                    const ys = tf.tensor1d(y_vals);
                    const l = loss(predict(xs), ys);
                    //l.print();
                    return l;          
                })

                const y1s = predict(tf.tensor1d([0,1]));
                let y1_vals = y1s.dataSync()
                let py0 = p5.map(y1_vals[0], 1, 0, 0, p5.height); 
                let py1 = p5.map(y1_vals[1], 1, 0, 0, p5.height);
                
                p5.strokeWeight(2);
                p5.line(0, py0, p5.width, py1);
            
            }
        });
    }

    p5.mouseClicked = () => {
        let x = p5.constrain(p5.mouseX, 0, p5.width);
        let y = p5.constrain(p5.mouseY, 0, p5.height);
        x = p5.map(x, 0, p5.width, 0, 1);
        y = p5.map(y, 0, p5.height, 1, 0);
        x_vals.push(x);
        y_vals.push(y);
        console.log("x: "  + x + ", " + "y: " + y);
    }

    //expects one tensor as argument
    function predict(xs){
        //y = mx + b
        return xs.mul(m).add(b);
    }

    //expects two tensors as arguments
    function loss(pred, labels){
        return pred.sub(labels).square().mean();
    }

    function lineValues(){
        const p0y = predict(tf.scalar(0));
        const p1y = predict(tf.scalar(1));
    }

  

}

new p5(sketch);

/*const tensor = tf.tensor([122, 55, 0, 66], [2,2])
tensor.print();

const x = tf.variable(tf.tensor([1, 2, 3]));
x.assign(tf.tensor([4, 5, 6]));

x.print();

// Train a simple model:
const model = tf.sequential();
model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

model.fit(xs, ys, {
  epochs: 100,
  callbacks: {
    onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
  }
});*/