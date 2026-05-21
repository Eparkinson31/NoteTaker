import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PageHeader from "./components/PageHeader";
// Define the structure of a Note object used in the app to represent each task or note item.
interface Note {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}
// Main component of the app that manages the state and renders the UI for the note-taking application.
const TaskListApp = () => {
  const [taskName, setTaskName] = useState<string>("");
  const [tasks, setTasks] = useState<Note[]>([]);
  const [aiResponse, setAiResponse] = useState<string>("Ai Response goes here");
  // Function to add a new task to the list. It checks if the input is not empty, creates a new Note object, and updates the state with the new task.
  const getAiFromFlask = async (tasksforai: Note[]) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/ai_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasksforai),
      });
      return await response.text();
    } catch (error) {
      console.error(error);
      return "Error fetching AI response";
    }
  };
  const addTask = async () => {
    if (taskName.trim().length === 0) return;
    // Create a new Note object with a unique ID, the title from the input, and a default completed status of false.
    const newTask: Note = {
      id: Date.now().toString(),
      title: taskName,
      completed: false,
    };
    // Update the tasks state by adding the new task to the existing list and reset the input field.
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    const response = await getAiFromFlask(updatedTasks);
    setAiResponse(response);
    setTaskName("");
  };

  // Function to toggle the completed status of a task. It updates the tasks state by mapping through the existing tasks and toggling the completed property of the task with the matching ID.
  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
    const response = await getAiFromFlask(updatedTasks);
    setAiResponse(response);
  };
  // Function to delete a task from the list. It updates the tasks state by filtering out the task with the matching ID.
  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    const response = await getAiFromFlask(updatedTasks);
    setAiResponse(response);
  };

  // Function to render each task item in the FlatList. It displays a checkbox for marking the task as completed, the task title, and a delete icon. The styles are applied based on whether the task is completed or not.
  const renderTask: ListRenderItem<Note> = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.left}>
        <Checkbox
          value={item.completed}
          onValueChange={() => toggleTask(item.id)}
          color="#6F6C43"
        />

        <Text style={[styles.text, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </View>

      <Ionicons
        name="trash-outline"
        color="#b03924"
        size={20}
        onPress={() => deleteTask(item.id)}
      />
    </View>
  );
  // The main return statement of the component renders the UI, including a TextInput for adding new tasks, a button to trigger the addTask function, and a FlatList to display the list of tasks using the renderTask function.
  return (
    <View style={styles.container}>
      <PageHeader headerText="Howdy! Welcome to my Note App" />

      <TextInput
        style={styles.input}
        placeholder="Type a note..."
        placeholderTextColor="#6F6C43"
        value={taskName}
        onChangeText={setTaskName}
      />

      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={{ color: "#fffcf2", fontWeight: "bold" }}>Add Note</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
      <Text style={{ marginTop: 20, color: "#bdcfd3" }}>
        Ai Response{""}
        <Text style={{ color: "#6F6C43", fontWeight: "bold" }}>
          {aiResponse}
        </Text>
      </Text>
    </View>
  );
};
// Styles for the app components and the add button are defined here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fffcf2",
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#6F6C43",
    marginBottom: 10,
    padding: 8,
  },
  // Styles for each task item in the list
  item: {
    padding: 15,
    backgroundColor: "#bdcfd3",
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // Styles for the left side of each task item, which includes the checkbox and the task title
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Styles for the task title text, with a margin to separate it from the checkbox
  text: {
    marginLeft: 10,
  },
  // Styles for the task title when the task is marked as completed, including a line-through decoration and gray color
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },

  // Styles for the add note button
  button: {
    backgroundColor: "#6F6C43",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  // Styles for the text inside the add note button, making it white and bold
  buttonText: {
    color: "#fffcf2",
    fontWeight: "bold",
  },
});

export default TaskListApp;
