let tasks = [];
let progressChart;

// Rest of the JavaScript remains unchanged

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();

    if (task !== "") {
        const priorityInput = document.getElementById("priorityInput");
        const priority = priorityInput.value;

        // Remove the "Priority: " prefix from the selected option
        const priorityOption = priorityInput.options[priorityInput.selectedIndex].text;
        const priorityWithoutPrefix = priorityOption.replace("Priority: ", "");

        const status = "Pending";

        tasks.push({ task, priority: priorityWithoutPrefix, status });
        tasks.sort((a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority)); // Sort tasks by priority
        addTaskToTable(task, priorityWithoutPrefix, status);
        saveTasksToLocalStorage();
        taskInput.value = "";
        priorityInput.value = "High";
        updateChart();
    }
}

function getPriorityValue(priority) {
    switch (priority) {
        case "High":
            return 3;
        case "Medium":
            return 2;
        case "Low":
            return 1;
        default:
            return 0;
    }
}

// Rest of the JavaScript remains unchanged


function addTaskToTable(task, priority, status) {
    const taskTable = document.getElementById("taskTable");
    const newRow = taskTable.insertRow(-1);

    const taskCell = newRow.insertCell(0);
    const priorityCell = newRow.insertCell(1);
    const statusCell = newRow.insertCell(2);
    const actionsCell = newRow.insertCell(3);

    taskCell.textContent = task;
    priorityCell.textContent = priority;
    statusCell.textContent = status;
    actionsCell.innerHTML = `<span class="delete-button" onclick="deleteTask(this)">Delete</span><span class="status-button" onclick="changeStatus(this)">Change Status</span>`;
}

function deleteTask(button) {
    const row = button.closest("tr");
    const rowIndex = row.rowIndex;

    tasks.splice(rowIndex - 1, 1);
    row.parentNode.removeChild(row);

    saveTasksToLocalStorage();
    updateChart();
}

function changeStatus(button) {
    const row = button.closest("tr");
    const rowIndex = row.rowIndex;
    const statusCell = row.cells[2];

    if (statusCell.textContent === "Pending") {
        statusCell.textContent = "In Progress";
        tasks[rowIndex - 1].status = "In Progress";
    } else if (statusCell.textContent === "In Progress") {
        statusCell.textContent = "Completed";
        tasks[rowIndex - 1].status = "Completed";
    } else {
        statusCell.textContent = "Pending";
        tasks[rowIndex - 1].status = "Pending";
    }

    saveTasksToLocalStorage();
    updateChart();
}

function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateChart() {
    const statusCounts = {
        "Pending": 0,
        "In Progress": 0,
        "Completed": 0
    };

    tasks.forEach(task => {
        statusCounts[task.status]++;
    });

    if (progressChart) {
        progressChart.data.datasets[0].data = Object.values(statusCounts);
        progressChart.update();
    } else {
        createProgressChart(statusCounts);
    }
}

// Rest of the JavaScript remains unchanged

function createProgressChart(statusCounts) {
    const progressChartCanvas = document.getElementById("progressChart").getContext("2d");
    const chartOptions = {
        type: "bar",
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ["#ff6666", "#ffa500", "#66cc66"],
                borderWidth: 2, // Add border width for the bars
                borderColor: "#ffffff", // Add border color for the bars
                borderRadius: 10, // Add border radius for the bars
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Task Progress",
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                    },
                    gridLines: {
                        display: false, // Hide grid lines for y-axis
                    },
                }],
                xAxes: [{
                    gridLines: {
                        display: false, // Hide grid lines for x-axis
                    },
                }],
            },
        },
    };

    progressChart = new Chart(progressChartCanvas, chartOptions);
}

// Rest of the JavaScript remains unchanged



document.addEventListener("DOMContentLoaded", function() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.sort((b, a) => getPriorityValue(a.priority) - getPriorityValue(b.priority)); // Sort tasks by priority
    tasks.forEach(task => {
        addTaskToTable(task.task, task.priority, task.status);
    });
    updateChart();
});

document.addEventListener("click", function(event) {
    const target = event.target;

    if (target.classList.contains("status-button")) {
        changeStatus(target);
    } else if (target.classList.contains("delete-button")) {
        deleteTask(target);
    }
});
