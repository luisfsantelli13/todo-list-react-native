const Task = require('../models/Task');

// GET /api/tasks - lista todas as tarefas
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error: error.message });
  }
};

// GET /api/tasks/:id - busca uma tarefa específica
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefa', error: error.message });
  }
};

// POST /api/tasks - cria uma nova tarefa
exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
    }

    const newTask = await Task.create({ title });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa', error: error.message });
  }
};

// PUT /api/tasks/:id - atualiza uma tarefa (título e/ou status)
exports.updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...(title !== undefined && { title }), ...(completed !== undefined && { completed }) },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa', error: error.message });
  }
};

// DELETE /api/tasks/:id - exclui uma tarefa
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir tarefa', error: error.message });
  }
};
