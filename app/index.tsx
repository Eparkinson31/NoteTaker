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

// Define the structure of a Note and what is used in the app to represent each task or note item.
interface Note {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

// Creates the main component of the app, which manages the state of the task name, the list of tasks, and the AI response.
// It includes functions to add a task, toggle the completed status of a task, delete a task, and fetch an AI response from
// a Flask backend based on the current list of tasks. The component renders the UI for adding new tasks, displaying the list
// of tasks, and showing the AI response.
const TaskListApp = () => {
  const [taskName, setTaskName] = useState<string>("");
  const [tasks, setTasks] = useState<Note[]>([]);
  const [aiResponse, setAiResponse] = useState<string>("Ai Response goes here");
  const getAiFromFlask = async (tasksforai: Note[]) => {
    // This coded sends the task list to a Flask backend and retrieves an AI response.
    // It uses the fetch API to make a POST request to the specified URL, sending the tasks as JSON in the request body.
    // The response is expected to be text, which is returned by the function. If there is an error during the fetch
    // operation, it logs the error and returns an error message.
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

  // Function to add a new task to the list. It creates a new task object with a unique ID, the title from the input,
  // and a completed status of false. The new task is added to the existing list of tasks, and the AI response is updated
  // by calling the getAiFromFlask function with the updated list of tasks.
  const addTask = async () => {
    if (taskName.trim().length === 0) return;
    const newTask: Note = {
      id: Date.now().toString(),
      title: taskName,
      completed: false,
    };

    // Update the tasks state with the new task and fetch the AI response based on the updated list of tasks.
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    const response = await getAiFromFlask(updatedTasks);
    setAiResponse(response);
    setTaskName("");
  };

  // Function to toggle the completed status of a task. It updates the tasks state by mapping through the
  // existing tasks and toggling the completed status of the task with the matching ID. After updating the tasks,
  // it fetches the AI response based on the updated list of tasks.
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

  // Function to render each task item in the FlatList. It displays a checkbox for marking the task as completed,
  // the task title, and a delete icon. The styles are applied based on whether the task is completed or not.
  // The Text component displays the title of the task, and its style
  // changes based on whether the task is completed or not.
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

  // The main return statement of the component renders the UI, including a TextInput for adding new tasks, a button to trigger
  // the addTask function, and a FlatList to display the list of tasks using the renderTask function.
  // The TextInput component allows the user to type in a new note. It is
  //styled with a border and padding, and it updates the taskName state as the user types.
  // The TouchableOpacity component is styled as a button, and when pressed,
  // it triggers the addTask function to add the new note to the list.
  // The FlatList component is used to render the list of tasks. // It takes
  // the tasks state as data and uses the renderTask function to render each
  // item in the list.  The keyExtractor is set to use the task's id for
  // efficient rendering

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
        Ai Response{" "}
        <Ionicons name="sparkles-outline" size={15} color="#bdcfd3" />
        <Text style={{ color: "#6F6C43", fontWeight: "bold" }}>
          {aiResponse}
        </Text>
      </Text>
    </View>
  );
};

// Styles for the app, including the container, input field, task items, and buttons.
// The styles are defined using the StyleSheet.create method from React Native.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fffcf2",
  },

  // Styles for the TextInput component where users can type in new notes.
  // It includes a bottom border, margin, and padding for better user experience.
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#6F6C43",
    marginBottom: 10,
    padding: 8,
  },

  // Styles for each task item in the list, including padding, background color, margin, and layout
  // for the checkbox and text.
  item: {
    padding: 15,
    backgroundColor: "#bdcfd3",
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Styles for the left side of the task item, which contains the checkbox and the task title.
  //  It arranges the elements in a row and centers them vertically.
  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Styles for the task title text, including a left margin and a specific color.
  text: {
    marginLeft: 10,
    color: "#6F6C43",
  },

  // Styles for the task title when the task is marked as completed, including a line-through decoration and red color
  completedText: {
    textDecorationLine: "line-through",
    color: "#b03924",
  },

  // Styles for the add note button, including background color, padding, border radius, and alignment.
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
