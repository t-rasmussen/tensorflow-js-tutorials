//https://kwj2104.github.io/2018/cppngan/
//tutorial on how to build a CPPN network (compositional pattern producing network) 
//This simple example uses a fully connected network which takes as input euclidian coordinates (x,y) 
//and maps them to a gray-scale or color value.  
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import * as tf from '@tensorflow/tfjs';
import PatternCPPN from './PatternCPPN.js';
import SquarePattern from './square_pattern.js';


const imageWidth = 250;
const imageHeight = 250;


//zs
//let zs = tf.randomNormal([latentDim], 0, 1);
//zs = zs.dataSync();

const sketch = (p5) => {

   
    let center1 = {x:0, y:0};
    let pattern1 = new SquarePattern(center1, p5);

    let center2 = {x:1*imageWidth, y:0};
    let pattern2 = new SquarePattern(center2, p5);

    let patternCross;


    p5.setup = () => {
        let canvas = p5.createCanvas(imageWidth*3, imageHeight);
        canvas.parent(document.getElementById('canvasContainer'));
        p5.background(0);

        let newBtn1 = p5.select('#newBtn1');
        let mutateBtn1 = p5.select('#mutateBtn1');
        newBtn1.elt.addEventListener('click', newPattern1);
        mutateBtn1.elt.addEventListener('click', mutatePattern1);

        let newBtn2 = p5.select('#newBtn2');
        let mutateBtn2 = p5.select('#mutateBtn2');
        newBtn2.elt.addEventListener('click', newPattern2);
        mutateBtn2.elt.addEventListener('click', mutatePattern2);

        let crossBtn = p5.select('#crossBtn');
        crossBtn.elt.addEventListener('click', crossOver);
    }

    p5.draw = () => {
        p5.clear();
        p5.background(0);

        pattern1.draw();
        pattern2.draw();

       if(patternCross){
            patternCross.draw();
        }
             
        p5.updatePixels();
    } 

    function newPattern1(){
        pattern1.newPattern();      
    }

    function mutatePattern1(){
        if(pattern1.getCPPN()){
            pattern1.mutatePattern();
        }
        else{
            alert("Flower 1 must be created before mutating it");
        }
    }

    function newPattern2(){
        pattern2.newPattern();       
    }

    function mutatePattern2(){
        if(pattern2.getCPPN()){
            pattern2.mutatePattern();
        }
        else{
            alert("Flower 2 must be created before mutating it");
        }
    }

    function crossOver(){
        if(pattern1.getCPPN() && pattern2.getCPPN()){
            patternCross = pattern1.crossOver(pattern2);
        }
        else{
            alert("Flower 1 and 2 must be generated before crossing them");
        }
    }

    

}



new p5(sketch);

