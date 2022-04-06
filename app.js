
// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Select
const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const count = root.querySelector('.todos-count');
const clear = root.querySelector('.todos-clear');
const form = document.forms.todos;
const input = form.elements.todo;

// Function
function saveItemTodos(todos){
    localStorage.setItem('todos', JSON.stringify(todos));
}


function renderTodo(todos){
    let todoString = '';
    count.innerText = todos.filter(todo => !todo.complete).length;
    clear.style.display = todos.filter(todo => todo.complete).length ? 'block' : 'none';
    todos = todos.forEach((todo, index) => {
        todoString += `
            <li data-id="${index}" ${todo.complete ? ' class="todos-complete"' : ''}>
                <input type="checkbox" ${todo.complete ? 'checked' : ''} />
                <span>${todo.label}</span>
                <button type="button"></button>
            </li>
        `;
        return todos;
    });
    list.innerHTML = todoString;
}


function addTodo(event){
    event.preventDefault();
    const label = input.value.trim();
    const complete = false;
    if(!label)return;
    todos = [
        ...todos,
        {
            label,
            complete
        }
    ];
    renderTodo(todos);
    saveItemTodos(todos);
    input.value = '';
}

function updateTodo(event){
    const id = parseInt(event.target.parentNode.getAttribute('data-id'), 10);
    const complete = event.target.checked;

    todos = todos.map((todo, index) => {
        if(id === index){
            return{
                ...todo,
                complete,
            }
        }
        return todo;
    });

    renderTodo(todos);
    saveItemTodos(todos);
}

function deleteTodo(event){
    if(event.target.nodeName.toLowerCase() !== 'button')return;
    const id = parseInt(event.target.parentNode.getAttribute('data-id'), 10);
    const label = event.target.previousElementSibling.innerText;
    if(window.confirm(`Delete ${label} Item`)){
        todos = todos.filter((todo, index) => id !== index);
        renderTodo(todos);
        saveItemTodos(todos);
    }
}


function clearCompleteTodo(){
    const count = todos.filter(todo => todo.complete).length;
    if(window.confirm(`Delete ${count} Todos?`)){
        todos = todos.filter(todo => !todo.complete);
        renderTodo(todos);
        saveItemTodos(todos);
    }
}


function editTodo(event){
    if(event.target.nodeName.toLowerCase() !== 'span')return;
    const id = parseInt(event.target.parentNode.getAttribute('data-id'), 10);
    const todoLabel = todos[id].label;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todoLabel;
    event.target.style.display = 'none';
    event.target.parentNode.append(input);

    function handleEdit(event){
        event.stopPropagation();
        const label = this.value;
        if(label !== todoLabel){
            todos = todos.map((todo, index) => {
                if(id === index){
                    return{
                        ...todo,
                        label
                    }
                }
                return todo;
            });
            renderTodo(todos);
            saveItemTodos(todos);
        }
        // Clean Up 
        event.target.style.display = '';
        this.removeEventListener('change', handleEdit);
    }

    input.addEventListener('change', handleEdit);
    input.focus();
}


// Init
function init(){
    renderTodo(todos);
    // Add Todo
    form.addEventListener('submit', addTodo);
    // Update Todo
    list.addEventListener('change', updateTodo);
    // Edit Todo
    list.addEventListener('dblclick', editTodo);
    // Delete Todo
    list.addEventListener('click', deleteTodo);
    // Clear Complete Todos
    clear.addEventListener('click', clearCompleteTodo);
}
init();