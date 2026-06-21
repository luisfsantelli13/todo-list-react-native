import { API_URL } from '../config/api';

// Busca todas as tarefas
export async function fetchTasks() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Erro ao buscar tarefas');
  }
  return response.json();
}

// Cria uma nova tarefa
export async function createTask(title) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar tarefa');
  }
  return response.json();
}

// Atualiza uma tarefa (título e/ou status de concluída)
export async function updateTask(id, changes) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar tarefa');
  }
  return response.json();
}

// Exclui uma tarefa
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao excluir tarefa');
  }
  return response.json();
}
