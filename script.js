
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, i) => {
      let li = document.createElement("li");
      li.className = "list-group-item d-flex align-items-center mb-2";
      if(task.completed) li.classList.add("completed");
      li.innerHTML = `
        <div class='task-details'>
          <span class="priority-${task.priority}">${task.priority}</span> |
          <span class="category-${task.category}">${task.category}</span> |
          <span>${task.text}</span>
          ${task.dueDate ? " | <span>Due: " + task.dueDate + "</span>" : ""}
        </div>
        <button class="btn btn-success btn-edit btn-sm">Edit</button>
        <button class="btn btn-danger btn-delete btn-sm">Delete</button>
      `;
      // completed toggling
      li.addEventListener('click', e => {
        if(e.target.classList.contains('btn-edit') || e.target.classList.contains('btn-delete')) return;
        task.completed = !task.completed;
        saveTasks(); renderTasks(filter);
      });
      // edit
      li.querySelector('.btn-edit').onclick = () => editTask(i);
      // delete
      li.querySelector('.btn-delete').onclick = () => { tasks.splice(i,1); saveTasks(); renderTasks(filter); };
      list.appendChild(li);
    });
}

function addTask() {
  let text = document.getElementById("taskInput").value.trim();
  let dueDate = document.getElementById("dueDate").value;
  let priority = document.getElementById("priority").value;
  let category = document.getElementById("category").value;
  if(!text) return;
  tasks.push({text, completed: false, dueDate, priority, category});
  saveTasks();
  renderTasks(document.getElementById("searchInput").value);
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
}

function editTask(i) {
  let newText = prompt("Edit task:", tasks[i].text);
  if(newText !== null && newText.trim() !== "") {
    tasks[i].text = newText.trim();
    saveTasks();
    renderTasks(document.getElementById("searchInput").value);
  }
}

document.getElementById("addButton").onclick = addTask;
document.getElementById("searchInput").oninput = e => renderTasks(e.target.value);
document.getElementById("themeSwitch").onclick = () => {
  document.body.classList.toggle('dark-mode');
};
renderTasks();