const path = require('path');

module.exports = {
  entry: {
     linear_regression: './src/linear_regression.js',
     layers_tutorial: './src/layers_tutorial.js',
     cppn_tutorial: './src/cppn_tutorial.js',
     cppn_flowers: './src/cppn_flowers.js',
     cppn_flowers2: './src/cppn_flowers2.js',
     cppn_flowers3: './src/cppn_flowers3.js',
     cppn_shirtpatterns: './src/cppn_shirtpatterns.js',
     cppn_2dspaceships: './src/cppn_2dspaceships.js',
     flappy: './src/neuroevolution/sketch.js',
     dungeon_partitioning: './src/dungeon_generator/partitioning.js',
     dungeon_cellular_automata: './src/dungeon_generator/cellular_automata.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  mode: 'development'
};