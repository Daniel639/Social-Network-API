// Defines Thought model and Reaction

const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new mongoose.Schema({
  // Reaction schema definition...
});

const ThoughtSchema = new mongoose.Schema({
  // Thought schema definition...
});

const Thought = mongoose.model('Thought', ThoughtSchema);

module.exports = Thought;