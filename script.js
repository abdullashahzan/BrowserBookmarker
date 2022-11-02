var taskArr = [];

const updateView = () => {

    const tasksList = document.getElementById("tasksList");

    var child = tasksList.lastChild;
    while (child) {
        tasksList.removeChild(child);
        child = tasksList.lastChild;
    }

    taskArr.forEach((Element, index) => {

        const newTask = document.createElement("div");
        newTask.setAttribute("class", "task-div");

        const taskText = document.createElement("div");
        taskText.setAttribute("class", "task-text");
        taskText.setAttribute("style", "margin:10px; padding-top: 20px;");
        taskText.innerHTML = `<a class='h5' target='_blank' href='${Element[0]}'>${Element[1]}</a>`

        const underlinee = document.createElement("div");
        underlinee.innerHTML = `<hr>`

        const taskControls = document.createElement("div");
        taskControls.setAttribute("class", "task-controls");

        const taskDelete = document.createElement("button");
        taskDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
        </svg>`;
        taskDelete.setAttribute("id", index + "delete");
        taskDelete.setAttribute("class", "task-btn task-btn-delete btn btn-outline-dark btn-sm");
        taskDelete.setAttribute("style", "margin:5px 0 0 10px;");
        taskDelete.addEventListener("click", (event) => deleteTask(event.target.id));

        taskControls.appendChild(taskDelete);

        newTask.appendChild(taskText);
        newTask.appendChild(taskControls);
        newTask.appendChild(underlinee);

        tasksList.appendChild(newTask);
    });
}

const addTask = () => {
    let value = true
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        for (let i = 0; i < taskArr.length; i++) {
            if (taskArr[i][1] === tabs[0].title) {
                alert("Bookmark already exists!")
                value = false
                break
            }
        }
        if (value === true) {
            taskArr.unshift([tabs[0].url, tabs[0].title])
            localStorage.setItem("savedTasks", JSON.stringify(taskArr));
            updateView();
            alert("Bookmark added successfully!")
        }
    });
}

const deleteTask = (id) => {
    const taskIndex = parseInt(id[0]);
    if (confirm(`Are you sure you want to delete this bookmark?`)) {
        taskArr.splice(taskIndex, 1);
        localStorage.setItem("savedTasks", JSON.stringify(taskArr));
        updateView();
    } else {
        updateView();
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
    if (savedTasks !== null) taskArr = [...savedTasks];
    updateView();
})

document.getElementById("task-submit-btn").addEventListener("click", () => addTask());

