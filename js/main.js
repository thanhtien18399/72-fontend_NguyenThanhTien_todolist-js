var listTodo = [];
var listComleteTodo = [];
var ulCompleted = document.getElementById("completed");
var ulTodo = document.getElementById("todo");
function addTask() {
    var id = Math.floor(Math.random() * 100) + 1;
    var task = document.getElementById("newTask").value;
    var status = "todo";
    if (task === "") {
        return alert("Tên Task không được để rỗng!!! ");
    }
    if (finByIdTask(id, task, listTodo) !== -1) {
        id = Math.floor(Math.random() * 100) + 1;
        return;
        // console.log("thay doi id",id);
    }
    var todo = new Todo(id, task, status);
    listTodo.push(todo);
    showToDoList(ulTodo);
    saveLocalstorage();
    document.getElementById("newTask").value = "";
}
// tim vitri 
function finByIdTask(id, task, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
        if (list[i].task === task) {
            alert("Trùng tên Task !!!vui lòng nhập lại ");
            return 1;
        }
    }

    return -1;
}
// render DS
function renderTodo(data) {
    var result = "";
    for (var i = 0; i < data.length; i++) {
        var curentTodo = data[i];
        result += ` <li >
        <span >${curentTodo.task}</span>
        <div class="buttons">
            <button class="remove" data-index="${i}" data-status="${curentTodo.status}" onclick="deleteTask(event,${curentTodo.id})">
                <i class="fa fa-trash-alt"></i>
            </button>
            <button class="complete" onclick="getTaskById(event,${curentTodo.id})" >
                <i class="fa fa-solid fa-rotate"></i>
            </button>
            <button class="complete" data-index="${i}" data-status="${curentTodo.status}" onclick="completeTodo(event)" >
                <i class="far fa-check-circle"></i>
                <i class="fas fa-check-circle"></i>
            </button>
            
        </div>
    </li>`
    }
    return result;
}

//show DS
function showToDoList(ulToDo) {
    ulToDo.innerHTML = renderTodo(listTodo);
}

function showCompleteList(ulCompleted) {
    ulCompleted.innerHTML = renderTodo(listComleteTodo);
}

// check độ dài (số lượng phần ) có trong mảng 
function checkLocation(arr) {
    var result = 0;
    for (var i = 0; i < arr.length; i++) {
        result = 1 + i;
    }
    return result;

}

function completeTodo(event) {
    var status = event.currentTarget.getAttribute("data-status");
    var index = event.currentTarget.getAttribute("data-index");
    var indexComplete = checkLocation(listComleteTodo);
    var indexTodo = checkLocation(listTodo);
    if (status === "todo") {
        listTodo[index].status = "completed";
        listComleteTodo.splice(indexComplete, 0, listTodo[index]);
        listTodo.splice(index, 1);


    } else if (status === "completed") {
        listComleteTodo[index].status = "todo";
        listTodo.splice(indexTodo, 0, listComleteTodo[index]);
        listComleteTodo.splice(index, 1);
    }
    saveLocalstorage();
    showCompleteList(ulCompleted);
    showToDoList(ulTodo);
}

//Xóa
function deleteTask(event, id) {
    var status = event.currentTarget.getAttribute("data-status");
    var indexComplete = finByIdTask(id, "", listComleteTodo);
    var indexTodo = finByIdTask(id, "", listTodo);
    // console.log("indextodo", indexTodo);
    // console.log("indexcompleted", indexComplete);
    if (status === "todo") {
        listTodo.splice(indexTodo, 1);
    }
    if (status === "completed") {
        listComleteTodo.splice(indexComplete, 1);
    }
    saveLocalstorage();
    showCompleteList(ulCompleted);
    showToDoList(ulTodo);

}

//Update
function getTaskById(event, id) {
    //tìm id
    var indexComplete = finByIdTask(id, "", listComleteTodo);
    var indexTodo = finByIdTask(id, "", listTodo);
    var todo = listTodo[indexTodo];
    var completed = listComleteTodo[indexComplete];
    //đưa thông tin lên input
    if (indexTodo > -1) {
        document.getElementById("txtId").value = id;
        document.getElementById("newTask").value = todo.task;
        document.getElementById("txtStatus").value = todo.status;

    }
    if (indexComplete > -1) {
        document.getElementById("txtId").value = id;
        document.getElementById("newTask").value = completed.task;
        document.getElementById("txtStatus").value = completed.status;
    }
    document.getElementById("addItem").style.display = "none";
    document.getElementById("upDateItem").style.display = "inline-block";
}
function updateTask() {
    //lay thong tin
    var id = +document.getElementById("txtId").value;
    var task = document.getElementById("newTask").value;
    //tim vi tri
    var indexComplete = finByIdTask(id, "", listComleteTodo);
    var indexTodo = finByIdTask(id, "", listTodo);
    //láy content tại vi trí đó
    var todo = listTodo[indexTodo];
    var completed = listComleteTodo[indexComplete];
    // thay đổi content
    if (indexTodo > -1) {
        todo.task = task;
    }
    if (indexComplete > -1) {
        completed.task = task;
    }
    saveLocalstorage();
    showCompleteList(ulCompleted);
    showToDoList(ulTodo);
    document.getElementById("addItem").style.display = "inline-block";
    document.getElementById("upDateItem").style.display = "none";
}

//localstorage
function saveLocalstorage() {
    var todoListJSON = JSON.stringify(listTodo);
    localStorage.setItem("listTodo", todoListJSON)
    var completedListJSON = JSON.stringify(listComleteTodo);
    localStorage.setItem("listCompleted", completedListJSON)
}
function getLocalStorage() {
    var todoListJSON = localStorage.getItem("listTodo",);
    var completedListJSON = localStorage.getItem("listCompleted",);
    if (!completedListJSON || !todoListJSON) {
        return;
    }
    var todoListLocal = JSON.parse(todoListJSON);
    var completedListLocal = JSON.parse(completedListJSON);
    listTodo = mapData(todoListLocal);
    listComleteTodo = mapData(completedListLocal);
    showToDoList(ulTodo);
    showCompleteList(ulCompleted);
}
//map data ve array
function mapData(List) {
    var result = [];
    for (var i = 0; i < List.length; i++) {
        var curent = List[i];
        var copiedList = new Todo(curent.id,
            curent.task,
            curent.status
        );
        result.push(copiedList);
    }
    return result;
}
getLocalStorage();