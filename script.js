// inisiasi
document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const addBtn = document.getElementById("addBtn");
  const taskLevel = document.getElementById("level");

  // load task dari local storage
  let tasksLocalStorage = JSON.parse(localStorage.getItem("task")) || [];

  // format tanggal dan waktu
  function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${date}, ${time}`;
  }

  // render task
  function renderTasks() {
    taskList.innerHTML = "";
    listDone.innerHTML = "";

    // Tambahkan tombol Delete All di atas listDone
    const deleteAllBtn = document.createElement("button");
    deleteAllBtn.textContent = "Delete All Tasks";
    deleteAllBtn.id = "deleteAllDone";
    deleteAllBtn.addEventListener("click", deleteAllDoneTasks);
    listDone.appendChild(deleteAllBtn);

    // logika todo list dan list done
    tasksLocalStorage.forEach((task, index) => {
      //   logika todo
      if (task.completed) {
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" ${
          task.completed ? "checked" : ""
        } data-id="${index}">
            <span class="completed">${task.text}</span>
            <span>|| ${task.levelTask} ||</span>
            <small class="task-time">${task.datetime}</small>
            `;

        listDone.appendChild(li);
      } else {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" ${
              task.completed ? "checked" : ""
            } data-id="${index}">
             <span class="${task.completed ? "completed" : ""}">${
          task.text
        }</span>
        <span>|| ${task.levelTask} ||</span>
        <small class="task-time">${task.datetime} || </small>
        <button style="border: 1px solid black; background-color: red; border-radius: 5px; color: white; padding: 1px; font-size: 10px" data-id="${index}">Delete</button>
        `;
        taskList.appendChild(li);
      }
    });
  }

  // add tasks to list
  function addTask() {
    const text = taskInput.value.trim();
    const levelTask = taskLevel.value;

    if (text) {
      // add time di list to do
      const newTask = {
        text: text,
        levelTask: levelTask,
        completed: false,
        datetime: getCurrentDateTime(), // Tambahkan waktu saat ini
      };
      tasksLocalStorage.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasksLocalStorage));
      taskInput.value = "";
      renderTasks();
    }
  }

  //   tanda task kumplit
  function tandaTasksKumplit(index) {
    tasksLocalStorage[index].completed = !tasksLocalStorage[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasksLocalStorage));
    renderTasks();
  }

  //   delete task
  function deleteTask(index) {
    tasksLocalStorage.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasksLocalStorage));
    renderTasks();
  }

  // event btn
  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") addTask();
  });

  taskList.addEventListener("click", function (event) {
    if (event.target.tagName === "INPUT") {
      tandaTasksKumplit(parseInt(event.target.dataset.id));
    } else if (event.target.tagName === "BUTTON") {
      deleteTask(parseInt(event.target.dataset.id));
    }
  });

  listDone.addEventListener("click", function (event) {
    if (event.target.tagName === "INPUT") {
      tandaTasksKumplit(parseInt(event.target.dataset.id));
    }
  });

  // delete semua task yang sudah selesai
  function deleteAllDoneTasks() {
    tasksLocalStorage = tasksLocalStorage.filter((task) => !task.completed);
    localStorage.setItem("tasks", JSON.stringify(tasksLocalStorage));
    renderTasks();
  }

  //   render task
  renderTasks();
});
