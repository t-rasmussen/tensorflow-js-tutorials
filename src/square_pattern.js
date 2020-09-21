import * as tf from '@tensorflow/tfjs';
import PatternCPPN from './PatternCPPN.js';

class SquarePattern{

    constructor(position, p5){
        this.position = position;
        this.p5 = p5;
        this.patternVals = [];

        this.patternWidth = 250;
        this.patternHeight = this.patternWidth;
        this.samplePoints = this.patternWidth * this.patternHeight;
    }

    getCPPN(){
        if(this.cppn){
            return this.cppn;
        }
        else{
            return null;
        }
    }

    setCPPN(cppn){
        this.patternVals = [];
        this.cppn = cppn;
        let model = this.cppn.getModel();

        tf.tidy( () => {
            let inputInterior = this.cppn.getInputTensor();
            
            let outputInterior = model.predict(inputInterior);

            let interiorVals = outputInterior.dataSync();

            this.patternVals.push({interior: interiorVals});
        })
    }

    newPattern(){
        console.log("new pattern")
        this.patternVals = [];
        this.cppn = new PatternCPPN(this.p5);
        let model = this.cppn.getModel();

        tf.tidy( () => {
            let inputInterior = this.cppn.getInputTensor();
            
            let outputInterior = model.predict(inputInterior);

            let interiorVals = outputInterior.dataSync();

            this.patternVals.push({interior: interiorVals});
        })
        
    }

    mutatePattern(){
        if(this.cppn.getModel()){
            console.log("mutate pattern");
            this.cppn.mutateModel();
            let model = this.cppn.getModel();
            this.patternVals = [];
            tf.tidy( () => {
                let inputInterior = this.cppn.getInputTensor();
            
                let outputInterior = model.predict(inputInterior);

                let interiorVals = outputInterior.dataSync();

                this.patternVals.push({interior: interiorVals});
            })
        
        }
    }

    crossOver(otherPattern){
        console.log('cross over');
        let currentModel = this.cppn.getModel();
        let otherModel = otherPattern.getCPPN().getModel();
        let newPattern;
        tf.tidy(() => {
            const w1 = currentModel.getWeights();
            const w2 = otherModel.getWeights();
            let newWs = new Array(w1.length);
            for (let i = 0; i < w1.length && i < w2.length; i++) {
                let shape = w1[i].shape;
                let arr1 = w1[i].dataSync().slice(); //same as copy
                let arr2 = w2[i].dataSync().slice(); //same as copy
                let newArr = new Array(arr1.length);
                for (let j = 0; j < arr1.length && j < arr2.length; j++) {
                    if(this.p5.random() > 0.5){
                        newArr[j] = arr1[j];
                    }
                    else{
                        newArr[j] = arr2[j];
                    }
                }
                let newW = tf.tensor(newArr, shape);
                newWs[i] = newW;
            }
            let newCPPN = new PatternCPPN(this.p5);
            let newModel = newCPPN.getModel();
            newModel.setWeights(newWs);
            newPattern = new SquarePattern({x:2*this.patternWidth, y:0}, this.p5);
            newPattern.setCPPN(newCPPN);
        });

        return newPattern;
    }

    draw(){
        //draw interior
        if(this.patternVals.length > 0){
            let interiorVals = this.patternVals[0].interior;
            let c = 0;
            for(let x = 0; x < this.patternWidth; x++){
                for(let y = 0; y < this.patternHeight; y++){
                    //equidistance coordinates as input
                    let r = Math.round(interiorVals[(c+0)] * 255.0);
                    let g = Math.round(interiorVals[(c+1)] * 255.0);
                    let b = Math.round(interiorVals[(c+2)] * 255.0);

                    this.p5.set(this.position.x + x, y, this.p5.color(r, g, b))
                    
                    c+= 3;
                }
            }  
        }                   
    }

}

export default SquarePattern;