import * as tf from '@tensorflow/tfjs';

class PatternCPPN{
    constructor(p5){
        this.p5 = p5;

        this.netSize = 32;
        this.numHidden = 6;
        this.outputNodes = 3;
        this.latentDim = 8;
        this.activationFunction = 'tanh'

        //                r  
        this.inputSize =  1 + this.latentDim

        //
        this.patternWidth = 250;
        this.patternHeight = this.patternWidth;
        this.samplePoints = this.patternWidth * this.patternHeight;

        //zs - latent dimension
        this.zs = tf.randomNormal([this.latentDim], 0, 1);
        this.zs = this.zs.dataSync(); 

        this.model = this.buildModel(this.numHidden, this.activationFunction);
    }

    buildModel (numHidden, activationFunction) {
        const model = tf.sequential();
        const init  = tf.initializers.randomNormal({ mean: 0, stddev: 1 });
    
        const inputLayer = tf.layers.dense(
            { units:             this.netSize
            , batchInputShape:   [null, this.inputSize] //null means undefined number of batches of size 'inputSize'
            , activation:        activationFunction
            , kernelInitializer: init
            , biasIntializer:    init
            });
    
        model.add(inputLayer);
    
        for (let k = 0; k < numHidden-1; k++) {
            model.add(tf.layers.dense(
                { units:             this.netSize
                , activation:        activationFunction
                , kernelInitializer: init
                , biasIntializer:    init
                }
            ));
        }
    
        model.add(tf.layers.dense({ units: this.outputNodes, activation: "sigmoid" }));
    
        return model;
    }

    getModel(){
        if(this.model){
            return this.model;
        }
        else return null;
    }
    
    
    getInputTensor(){        
        let pixelArr = new Array(this.samplePoints*this.inputSize);
        let c = 0;
        for(let x = 0; x < this.patternWidth; x++){
            for(let y = 0; y < this.patternHeight; y++){
                //equidistance point as input
             //   let x2 = (x - this.patternWidth/2.0)*(x - this.patternWidth/2.0);
              //  let y2 = (y - this.patternHeight/2.0)*(y - this.patternHeight/2.0);
              //  pixelArr[c] = this.normalisedCoord(Math.sqrt(x2 + y2), this.patternWidth, this.patternHeight);
                let y2sqr = Math.sqrt((y - this.patternHeight/2.0)*(y - this.patternHeight/2.0));
                pixelArr[c] = this.normalisedCoord(y2sqr, this.patternWidth, this.patternHeight);
                c++;

                 //latent vector k as input
                 for(let k = 0; k < this.zs.length; k++){
                    pixelArr[c] = this.zs[k];
                    c++;
                }  
            }              
        }        
    
        const tfinput = tf.tensor2d(pixelArr, [this.samplePoints, this.inputSize]);
        return tfinput;
    }

    normalisedCoord(r, patternWidth, patternHeight) {
        const normR      = (r - (patternWidth/2))  / patternWidth;
      
        return normR;
    }
    
    // Retrieve the weights of the model, then mutate them
    mutateModel() {
        tf.tidy(() => {
            const w = this.model.getWeights();
            for (let i = 0; i < w.length; i++) {
                let shape = w[i].shape;
                let arr = w[i].dataSync().slice(); //same as copy
                for (let j = 0; j < arr.length; j++) {
                    arr[j] = this.mutateWeight(arr[j]);
                }
                let newW = tf.tensor(arr, shape);
                w[i] = newW;
            }
            this.model.setWeights(w);
        });
    }
    
    // Mutation function
    mutateWeight(x) {
        let mutation = 0.1;
        if (this.p5.random(1) < mutation) {
            let offset = this.p5.randomGaussian() * 0.25; //0.5
            let newx = x + offset;
            return newx;
        } else {
            return x;
        }
    }

    //clean up
    dispose(){

    }
}

export default PatternCPPN;