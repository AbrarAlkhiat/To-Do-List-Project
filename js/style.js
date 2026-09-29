// Data & State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentLang = localStorage.getItem('lang') || 'ar';
let currentTheme = localStorage.getItem('theme') || 'light';

// Translations Dictionary
const translations = {
    ar: {
        appTitle: '<i class="fa-solid fa-list-check me-2"></i> قائمة المهام',
        placeholder: 'أضف مهمة جديدة...',
        addBtn: '<i class="fa-solid fa-plus me-1"></i> إضافة',
        optLow: '🔵 منخفضة',
        optMed: '🟠 متوسطة',
        optHigh: '🔴 عالية',
        filterAll: 'الكل',
        filterActive: 'النشطة',
        filterCompleted: 'المكتملة',
        counter: 'المهام المتبقية: ',
        emptyMsg: 'لا توجد مهام حالياً!',
        clearText: 'مسح الكل'
    },
    en: {
        appTitle: '<i class="fa-solid fa-list-check me-2"></i> To-Do List',
        placeholder: 'Add a new task...',
        addBtn: '<i class="fa-solid fa-plus me-1"></i> Add',
        optLow: '🔵 Low',
        optMed: '🟠 Medium',
        optHigh: '🔴 High',
        filterAll: 'All',
        filterActive: 'Active',
        filterCompleted: 'Completed',
        counter: 'Pending tasks: ',
        emptyMsg: 'No tasks available!',
        clearText: 'Clear All'
    }
};

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const langBtn = document.getElementById('lang-btn');
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const pendingCount = document.getElementById('pending-count');
const clearAllBtn = document.getElementById('clear-all');
const filterBtns = document.querySelectorAll('.btn-filter');

let currentFilter = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    renderTasks();
});

// Event Listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTask(text, prioritySelect.value);
        todoInput.value = '';
    }
});

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    applyLanguage(currentLang);
});

themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
});

clearAllBtn.addEventListener('click', () => {
    if (confirm(currentLang === 'ar' ? 'هل أنت تأكد من مسح جميع المهام؟' : 'Are you sure you want to clear all tasks?')) {
        tasks = [];
        saveAndRender();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTasks();
    });
});

// Task Actions (Add, Toggle, Delete)
function addTask(text, priority) {
    const newTask = {
        id: Date.now(),
        text,
        priority,
        completed: false
    };
    tasks.push(newTask);
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// Render UI
function renderTasks() {
    todoList.innerHTML = '';
    
    let filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        emptyState.classList.remove('d-none');
    } else {
        emptyState.classList.add('d-none');
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item task-item priority-${task.priority} ${task.completed ? 'completed' : ''} d-flex justify-content-between align-items-center p-3`;
            
            li.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <input class="form-check-input my-0" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <span class="task-text fw-medium">${escapeHTML(task.text)}</span>
                </div>
                <button class="btn btn-sm btn-outline-danger border-0 rounded-circle" onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            todoList.appendChild(li);
        });
    }

    updateStats();
}

function updateStats() {
    const pending = tasks.filter(t => !t.completed).length;
    pendingCount.textContent = pending;
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Language Handler
function applyLanguage(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.getElementById('app-title').innerHTML = translations[lang].appTitle;
    todoInput.placeholder = translations[lang].placeholder;
    document.getElementById('add-btn').innerHTML = translations[lang].addBtn;
    document.getElementById('opt-low').textContent = translations[lang].optLow;
    document.getElementById('opt-med').textContent = translations[lang].optMed;
    document.getElementById('opt-high').textContent = translations[lang].optHigh;
    document.getElementById('filter-all').textContent = translations[lang].filterAll;
    document.getElementById('filter-active').textContent = translations[lang].filterActive;
    document.getElementById('filter-completed').textContent = translations[lang].filterCompleted;
    document.getElementById('task-counter').childNodes[0].textContent = translations[lang].counter;
    document.getElementById('empty-msg').textContent = translations[lang].emptyMsg;
    document.getElementById('clear-text').textContent = translations[lang].clearText;
    document.getElementById('lang-text').textContent = lang === 'ar' ? 'EN' : 'عربي';
}

// Theme Handler
function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun text-warning';
    } else {
        themeIcon.className = 'fa-solid fa-moon';
    }
}

// Security: Helper function to escape HTML string
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}