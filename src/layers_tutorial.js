import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';


const sketch = (p5) => {

    //neural network model
    const model = tf.sequential();

    //dense means the hidden layer is fully connected to the previous layer and has 4 nodes
    const hidden = tf.layers.dense({
        units: 4,
        activation: 'sigmoid',
        inputShape: [2]
    });

    //output layer is fully connected to the hidden layer and has 3 nodes
    const output = tf.layers.dense( {
        units: 1,
        activation: 'sigmoid'
    });

    //constructing the model by adding the layers
    model.add(hidden);
    model.add(output);

    //creating sgd optimizer. the job of the optimizer is to minimize the loss function 
    const sgdOptimizer = tf.train.sgd(0.1);
    const config = {
        optimizer: sgdOptimizer,
        loss: tf.losses.meanSquaredError
    }

    //the model must be compiled to tell it about the optimizer and loss function
    model.compile(config);


    //fitting means adjusting the weights in the neural network using the optimizer
    //training data
    const xs = tf.tensor2d([
        [0.5, 0.5],
        [0, 0],
        [1, 1]
        ]);

    const ys = tf.tensor2d([
        [0.5],
        [1],
        [0]
    ]);

    //train model
    async function train(){
        for(let i = 0; i < 1000; i++){
            const config = {
                shuffle: true,
                epochs: 10
            }
            const history = await model.fit(xs, ys, config);
            console.log(history.history.loss[0]);
        }
    }

    train().then(() => {
        console.log('training complete');
        model.predict(xs).print();
    });

    

   // console.log(history);




    p5.setup = () => {
        p5.createCanvas(640, 480);
    }

    p5.draw = () => {
        p5.clear();
        p5.background(p5.color(50, 50, 50));
    }

    

}




new p5(sketch);