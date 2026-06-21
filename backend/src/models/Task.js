const mongoose = require('mongoose');

// Schema define como cada tarefa é armazenada no MongoDB
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'O título da tarefa é obrigatório'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // cria automaticamente createdAt e updatedAt
  }
);

module.exports = mongoose.model('Task', taskSchema);
