// Logic for thought-related operations.

const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    console.log('getAllThoughts function called');
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ createdAt: -1 })
      .then(dbThoughtData => {
        console.log('Thoughts retrieved:', dbThoughtData);
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.error('Error in getAllThoughts:', err);
        res.status(500).json({ message: 'Server error', error: err.toString() });
      });
  },

  // Get one thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Create thought
  createThought(req, res) {
    let createdThought;
    Thought.create(req.body)
      .then(dbThoughtData => {
        createdThought = dbThoughtData;
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought created but no user found with this id!' });
        }
        res.json({ message: 'Thought successfully created!', thought: createdThought });
      })
      .catch(err => {
        console.error('Error in createThought:', err);
        res.status(400).json({ message: 'Error creating thought', error: err.toString() });
      });
  },

  // Update thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // Delete thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return User.findOneAndUpdate(
          { thoughts: req.params.id },
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought deleted but no user found with this thought id!' });
        }
        res.json({ message: 'Thought successfully deleted!' });
      })
      .catch(err => res.status(500).json(err));
  },

  // Add reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },
  
  // Remove reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        // Check if reaction was actually removed
        const reactionRemoved = !dbThoughtData.reactions.some(reaction => 
          reaction.reactionId.toString() === req.params.reactionId
        );
        if (reactionRemoved) {
          res.json(dbThoughtData);
        } else {
          return res.status(404).json({ message: 'No reaction found with this id!' });
        }
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;