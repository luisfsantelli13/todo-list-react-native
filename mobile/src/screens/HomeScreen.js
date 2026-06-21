import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'react-native';
import TaskItem from '../components/TaskItem';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/taskService';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Não foi possível carregar as tarefas. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async () => {
    const title = newTitle.trim();
    if (!title) return;

    try {
      setSubmitting(true);
      const created = await createTask(title);
      setTasks((prev) => [created, ...prev]);
      setNewTitle('');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  };

  const handleDelete = (task) => {
    Alert.alert('Excluir tarefa', `Deseja excluir "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(task._id);
            setTasks((prev) => prev.filter((t) => t._id !== task._id));
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Tarefas</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Adicionar nova tarefa..."
            placeholderTextColor="#999"
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addButton, submitting && styles.addButtonDisabled]}
            onPress={handleAddTask}
            disabled={submitting}
          >
            <Text style={styles.addButtonText}>{submitting ? '...' : '+'}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadTasks}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && tasks.length === 0 && (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhuma tarefa ainda. Adicione a primeira!</Text>
          </View>
        )}

        {!loading && !error && tasks.length > 0 && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} />
            )}
            contentContainerStyle={styles.listContent}
            onRefresh={loadTasks}
            refreshing={loading}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F5F5FA',
  },
  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#6C63FF',
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  errorText: {
    color: '#FF5C5C',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});
