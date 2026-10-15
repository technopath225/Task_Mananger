'use strict';

const STORAGE_KEY = 'taskflow.tasks.v1';
const LEGACY_KEYS = ['tasks', 'taskData', 'taskDatabase'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const $ = (id) => document.getElementById(id);
const elements = {
  list: $('taskList'), search: $('SearchInput'), filter: $('taskFilter'),
  modal: $('EditorWindow'), form: $('taskForm'), title: $('EditorTitle'),
  description: $('EditorDescription'), date: $('dueDate'), priority: $('EditorPriority'),
  status: $('EditorStatus'), error: $('formError'), delete: $('DeleteBtn'),
  heading: $('modalHeading'), empty: $('emptyState')
};
let tasks = loadTasks();
let editingId = null;
let previousFocus = null;

function normalizeTask(task) {
  if (!task || typeof task !== 'object') return null;
  const title = String(task.title ?? '').trim();
  if (!title) return null;
  const dueDate = normalizeDate(task.dueDate);
  return {
    id: String(task.id ?? generateId()), title,
    description: String(task.description ?? ''),
    priority: PRIORITIES.includes(task.priority) ? task.priority : 'Medium',
    status: STATUSES.includes(task.status) ? task.status : 'Pending',
    dueDate,
    createdDate: normalizeDate(task.createdDate) || todayISO()
  };
}

function normalizeDate(value) {
  if (typeof value !== 'string') return '';
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  const iso = match ? `${match[3]}-${match[2]}-${match[1]}` : value;
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!parts) return '';
  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? iso : '';
}

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function generateId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function loadTasks() {
  for (const key of [STORAGE_KEY, ...LEGACY_KEYS]) {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) continue;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) continue;
      const loaded = parsed.map(normalizeTask).filter(Boolean);
      if (key !== STORAGE_KEY) localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
      return loaded;
    } catch (error) {
      console.warn(`Unable to read saved tasks from ${key}`, error);
    }
  }
  return [];
}
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Could not save tasks', error);
    alert('Your browser could not save these changes. Check that local storage is available.');
    return false;
  }
}
function commit(nextTasks) {
  const previous = tasks;
  tasks = nextTasks;
  if (!persist()) { tasks = previous; return false; }
  render();
  return true;
}
function dateLabel(iso) {
  if (!iso) return 'No due date';
  const [year, month, day] = iso.split('-');
  return `${day}-${month}-${year}`;
}
function daysUntil(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  const dueUTC = Date.UTC(year, month - 1, day);
  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((dueUTC - todayUTC) / 86400000);
}
function dueLabel(task) {
  if (!task.dueDate) return 'No date set';
  if (task.status === 'Completed') return 'Completed';
  const days = daysUntil(task.dueDate);
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? '' : 's'} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `In ${days} days`;
}
function makeSelect(values, current, label, onChange) {
  const select = document.createElement('select');
  select.className = 'task-select';
  select.setAttribute('aria-label', label);
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
  select.value = current;
  select.addEventListener('click', (event) => event.stopPropagation());
  select.addEventListener('keydown', (event) => event.stopPropagation());
  select.addEventListener('change', (event) => onChange(event.target.value));
  return select;
}
function updateTask(id, changes) {
  commit(tasks.map((task) => task.id === id ? { ...task, ...changes } : task));
}
function createCard(task) {
  const item = document.createElement('li');
  const card = document.createElement('article');
  const days = daysUntil(task.dueDate);
  const urgency = task.status === 'Completed' || days === null ? 'later' : days <= 5 ? 'urgent' : days <= 10 ? 'soon' : 'later';
  card.className = `task-card ${urgency}`;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Edit ${task.title}`);
  const info = document.createElement('div');
  info.className = 'task-info';
  const title = document.createElement('h3');
  title.className = 'task-title';
  title.textContent = task.title;
  const description = document.createElement('p');
  description.className = 'task-description';
  description.textContent = task.description || 'No description';
  info.append(title, description);
  const date = document.createElement('div');
  date.className = `task-date ${days !== null && days < 0 && task.status !== 'Completed' ? 'overdue' : ''}`;
  date.textContent = dateLabel(task.dueDate);
  const relative = document.createElement('small');
  relative.textContent = dueLabel(task);
  date.append(relative);
  const priority = makeSelect(PRIORITIES, task.priority, `Priority for ${task.title}`, (value) => updateTask(task.id, { priority: value }));
  const status = makeSelect(STATUSES, task.status, `Status for ${task.title}`, (value) => updateTask(task.id, { status: value }));
  card.append(info, date, priority, status);
  card.addEventListener('click', () => openEditor(task.id));
  card.addEventListener('keydown', (event) => {
    if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openEditor(task.id);
    }
  });
  item.append(card);
  return item;
}
function render() {
  $('totalCount').textContent = tasks.length;
  $('pendingCount').textContent = tasks.filter((task) => task.status === 'Pending').length;
  $('progressCount').textContent = tasks.filter((task) => task.status === 'In Progress').length;
  $('completedCount').textContent = tasks.filter((task) => task.status === 'Completed').length;
  const query = elements.search.value.trim().toLocaleLowerCase();
  const filter = elements.filter.value;
  const visible = tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.description}`.toLocaleLowerCase().includes(query);
    const matchesFilter = filter === 'all' || task.status === filter || task.priority === filter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  $('visibleCount').textContent = visible.length;
  elements.list.replaceChildren(...visible.map(createCard));
  elements.empty.hidden = visible.length !== 0;
}
function showError(message) {
  elements.error.textContent = message;
  elements.error.hidden = !message;
}
function openEditor(id = null) {
  editingId = id;
  const task = tasks.find((item) => item.id === id);
  previousFocus = document.activeElement;
  elements.form.reset();
  showError('');
  elements.heading.textContent = task ? 'Edit task' : 'New task';
  elements.delete.hidden = !task;
  elements.title.value = task?.title ?? '';
  elements.description.value = task?.description ?? '';
  elements.date.value = task?.dueDate ?? todayISO();
  elements.priority.value = task?.priority ?? 'Medium';
  elements.status.value = task?.status ?? 'Pending';
  elements.modal.hidden = false;
  document.body.style.overflow = 'hidden';
  elements.title.focus();
}
function closeEditor() {
  elements.modal.hidden = true;
  document.body.style.overflow = '';
  editingId = null;
  previousFocus?.focus?.();
}
function saveTask(event) {
  event.preventDefault();
  const title = elements.title.value.trim();
  const description = elements.description.value.trim();
  const dueDate = normalizeDate(elements.date.value);
  if (!title) { showError('Please enter a task title.'); elements.title.focus(); return; }
  if (!dueDate) { showError('Please choose a valid due date.'); elements.date.focus(); return; }
  if (!PRIORITIES.includes(elements.priority.value) || !STATUSES.includes(elements.status.value)) {
    showError('Please select a valid priority and status.'); return;
  }
  const changes = { title, description, dueDate, priority: elements.priority.value, status: elements.status.value };
  const next = editingId === null
    ? [...tasks, { id: generateId(), createdDate: todayISO(), ...changes }]
    : tasks.map((task) => task.id === editingId ? { ...task, ...changes } : task);
  if (commit(next)) closeEditor();
}
function deleteTask() {
  if (editingId === null) return;
  const task = tasks.find((item) => item.id === editingId);
  if (!task || !confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
  if (commit(tasks.filter((item) => item.id !== editingId))) closeEditor();
}
$('Create').addEventListener('click', () => openEditor());
$('closeEditor').addEventListener('click', closeEditor);
$('discard').addEventListener('click', closeEditor);
elements.form.addEventListener('submit', saveTask);
elements.delete.addEventListener('click', deleteTask);
elements.search.addEventListener('input', render);
elements.filter.addEventListener('change', render);
elements.modal.addEventListener('click', (event) => {
  if (event.target === elements.modal) closeEditor();
});
document.addEventListener('keydown', (event) => {
  if (elements.modal.hidden) return;
  if (event.key === 'Escape') closeEditor();
  if (event.key === 'Tab') {
    const focusable = [...elements.modal.querySelectorAll('button:not([hidden]),input,textarea,select')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
render();
