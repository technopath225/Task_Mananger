


console.log("this works");
let activeID = -1;
const list = document.getElementById("taskList");
const editor = document.getElementById("EditorWindow");
const editorTitle = document.getElementById("EditorTitle");
const editorDate = document.getElementById("dueDate");
const editorPriority = document.getElementById("EditorPriority");
const editorStatus = document.getElementById("EditorStatus");
const editorDescription = document.getElementById("EditorDescription");
const saveBtn = document.getElementById("save");
const discardBtn = document.getElementById("discard");
const searchButton = document.getElementById("Go");
const SearchInput = document.getElementById("SearchInput");
editor.className = "Hide";
const DeleteBtn = document.getElementById("DeleteBtn");
const CreateBtn = document.getElementById("Create");
const taskObj= {
    id:2,
title:"THE at least we are going some",
createdDate:"23-O9-2026",
dueDate:"20-10-2026",
priority:"Medium",
status:"Completed",
description:"this project is made to hepl with projects"


}

let hasRendered = false;


let templateTask = {
        id: 12,
        title: "",
        createdDate: "08-10-2026",
        dueDate: "10-11-2026",
        priority: "Low",
        status: "Pending",
        description: ""
    }

const taskDatabase = [
    {
        id: 1,
        title: "Design the homepage",
        createdDate: "18-09-2026",
        dueDate: "16-10-2026",
        priority: "High",
        status: "In Progress",
        description: "Create the initial layout and design for the homepage."
    },
    {
        id: 2,
        title: "The At LeastAre Going Somewhere",
        createdDate: "19-09-2026",
        dueDate: "22-10-2026",
        priority: "Medium",
        status: "Completed",
        description: "This project is made to help with projects."
    },
    {
        id: 3,
        title: "Fix navigation bugs",
        createdDate: "21-09-2026",
        dueDate: "15-10-2026",
        priority: "High",
        status: "Pending",
        description: "Identify and fix navigation issues across the application."
    },
    {
        id: 4,
        title: "Write project documentation",
        createdDate: "23-09-2026",
        dueDate: "25-10-2026",
        priority: "Low",
        status: "Initialised",
        description: "Document the main features and explain how the application works."
    },
    {
        id: 5,
        title: "Implement task filtering",
        createdDate: "25-09-2026",
        dueDate: "18-10-2026",
        priority: "Medium",
        status: "In Progress",
        description: "Allow users to filter tasks by priority and status."
    },
    {
        id: 6,
        title: "Create login page",
        createdDate: "27-09-2026",
        dueDate: "30-10-2026",
        priority: "High",
        status: "Pending",
        description: "Build a login interface with form validation."
    },
    {
        id: 7,
        title: "Optimize CSS layouts",
        createdDate: "29-09-2026",
        dueDate: "02-11-2026",
        priority: "Low",
        status: "Initialised",
        description: "Improve responsive layouts and remove unnecessary styles."
    },
    {
        id: 8,
        title: "Test popup functionality",
        createdDate: "01-10-2026",
        dueDate: "16-10-2026",
        priority: "Medium",
        status: "Completed",
        description: "Test opening, closing, and validating popup components."
    },
    {
        id: 9,
        title: "Build task creation form",
        createdDate: "03-10-2026",
        dueDate: "21-10-2026",
        priority: "High",
        status: "In Progress",
        description: "Create a form that allows users to add and save new tasks."
    },
    {
        id: 10,
        title: "Review application performance",
        createdDate: "05-10-2026",
        dueDate: "05-11-2026",
        priority: "Low",
        status: "Pending",
        description: "Check loading times and identify performance improvements."
    },
    {
        id: 11,
        title: "Add dark mode",
        createdDate: "06-10-2026",
        dueDate: "28-10-2026",
        priority: "Medium",
        status: "Initialised",
        description: "Implement a dark theme using CSS variables."
    },
    {
        id: 12,
        title: "Deploy the application",
        createdDate: "08-10-2026",
        dueDate: "10-11-2026",
        priority: "High",
        status: "Pending",
        description: "Prepare the project for deployment and verify the production build."
    }
];


let taskData = taskDatabase;
let priorityLevels = ["Low","Medium","High"];
var priorityDays = [5,10];
let statusLevels = ["Pending","Initialised","In Progress","Completed"];

const GetTaskFromID = (rid) => {
    // Number(rid) converts browser string "1" into numeric 1 to match your array
    let task = taskData.find(item => item.id === Number(rid));
    console.log("Found task object:", task);
    return task; 
}

const ReplaceTaskByID = (updatedTask) => {
    const index = taskData.findIndex(task => task.id === updatedTask.id);

    if (index !== -1) {
        taskData[index] = updatedTask;
    }
};
const LoadTaskToEditor = (task) => {

editorTitle.value = task.title;

editorPriority.value = task.priority;
editorStatus.value = task.status;
editorDescription.textContent = task.description;

  const [day, month, year] = task.dueDate.split("-").map(Number);

  const dueDate = new Date(year, month - 1, day);
  const today = new Date();

  editorDate.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  editor.className = "Show";
  
  activeID = task.id;
}


const ReloadDOM = () => {
 list.replaceChildren();
  taskData.forEach(element => {list.appendChild(CreateNewSlide(element,priorityLevels,statusLevels));  })
}


const ReloadDOMWithIndexes = (ids) => {
    list.replaceChildren();

    ids.forEach(id => {
        const task = taskData.find(task => task.id === id);

        if (task) {
            list.appendChild(
                CreateNewSlide(task, priorityLevels, statusLevels)
            );
        }
    });
};

const SaveTaskFromEditor = () => {
    console.log(activeID);
    console.log("fkjahbfkjafjajk");
   const task = GetTaskFromID(activeID);
    task.title = editorTitle.value;
    console.log(`THE priority value${editorPriority.textContent}`);
    task.status = editorStatus.value;
     console.log(`THE priority value${editorStatus.value}`);
    task.description = editorDescription.value;
    task.id = activeID;
    const [year, month, day] = editorDate.value.split("-").map(Number);

    task.dueDate = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
   

   // console.log(`the new ${task}`);
  //  console.log(task);

    ReplaceTaskByID(task);
};


function daysUntilDue(dateString) {
    const [day, month, year] = dateString.split("-").map(Number);

  const dueDate = new Date(year, month - 1, day);
  const today = new Date();

  // Reset time to midnight
  today.setHours(0, 0, 0, 0);
//console.log(dueDate)
  // Validate the date
  if (
    dueDate.getFullYear() !== year ||
    dueDate.getMonth() !== month - 1 ||
    dueDate.getDate() !== day
  ) {
    return "Invalid date";
  }

  const difference = dueDate.getTime() - today.getTime();

  return Math.round(difference / (1000 * 60 * 60 * 24));
    }

const  CreateOptions = (element,parent,index) => {

    let plevel = document.createElement("option");
    plevel.textContent = element;
    plevel.value = element
    plevel.id = index;
    parent.appendChild(plevel);

}

const CreateNewSlide = (task,prioLevels,statLevels) => {

let listItem = document.createElement("li");
let slide = document.createElement("div");
let titleSection = document.createElement("div");
let title = document.createElement("div");
let dueSection = document.createElement("div");
let due = document.createElement("div");
let date = document.createElement("div");
let slideHeader = document.createElement("div");
let contentHolder = document.createElement("div");

let inlineSection = document.createElement("div");
let inlineTitle= document.createElement("div");
let inlineDesci = document.createElement("div");

inlineSection.className = "inlineSection";
inlineTitle.className = "inlineTitle";
inlineDesci.className = "inlineDesci";
inlineDesci.textContent = task.description;
inlineSection.appendChild(inlineTitle);
inlineSection.appendChild(inlineDesci);



listItem.id = task.id;
date.textContent= task.dueDate;
date.className = "Date";
due.className = "Due";

titleSection.className = "TitleSection";
slideHeader.className = "SlideHeader";
title.textContent = task.title;
title.className = "Title";
dueSection.className = "DueSection"
slide.id = "slide";
let daysleft = daysUntilDue(task.dueDate); 


//console.log(`days left : ${daysleft} `)
if(daysleft <= priorityDays[0]){
slide.className = "LevelRed";
}else if(daysleft <= priorityDays[1]){
slide.className = "LevelYellow";
}else{
slide.className = "LevelGreen";
}

due.textContent = `Due in ${daysleft} days`;




dueSection.appendChild(due);
dueSection.appendChild(date);
inlineTitle.textContent = "Description"

titleSection.appendChild(title);
titleSection.appendChild(dueSection);


//options status prioriry
let upperRightSection= document.createElement("div");

let  PrioritySection = document.createElement("div");
let priorityTitle = document.createElement("div");
const priority = document.createElement("select");


let StatusSection = document.createElement("div");
let statusTitle = document.createElement("div");
const status = document.createElement("select");



prioLevels.forEach((element,index) => {
    CreateOptions(element,priority,index);
   // console.log(element);
});

statLevels.forEach((element,index) => {
    CreateOptions(element,status,index);
   // console.log(element);
});

upperRightSection.className = "UpperRightSection";

priorityTitle.className = "OptionsNames";
priorityTitle.textContent = "Priority"
priority.className = "Options";
priority.value = task.priority;
//console.log(priority.textContent)
//console.log(priority.value);
PrioritySection.className = "PrioritySection";
StatusSection.className = "StatusSection";
statusTitle.className = "OptionsNames";
statusTitle.textContent = "Status";
status.className="Options";
status.value = task.status;

PrioritySection.appendChild(priorityTitle);
PrioritySection.appendChild(priority);
upperRightSection.appendChild(PrioritySection);

StatusSection.appendChild(statusTitle);
StatusSection.appendChild(status);
upperRightSection.appendChild(StatusSection);






slideHeader.appendChild(titleSection);
slideHeader.appendChild(inlineSection);
slideHeader.appendChild(upperRightSection)
contentHolder.appendChild(slideHeader);

slide.appendChild(contentHolder);
listItem.appendChild(slide);




  priority.addEventListener("change", (event) => {
    let tempTask = GetTaskFromID(task.id);
    const option = event.target.selectedOptions[0];

    const value = option.value;
    const text = option.textContent;
    tempTask.priority = value;
    ReplaceTaskByID(tempTask);
    ReloadDOM();
    //console.log(tempTask);
})

  status.addEventListener("change", (event) => {
    let tempTask = GetTaskFromID(task.id);
    const option = event.target.selectedOptions[0];

    const value = option.value;
    const text = option.textContent;
    tempTask.status = value;
    ReplaceTaskByID(tempTask);
   // console.log({ value, text});
  

    ReloadDOM();
   // console.log(tempTask);
})
    



slide.addEventListener("click", (event) => {
    if (event.target.closest("select")) {
       console.log("options");



    }else{
         console.log("Body preesed")
         LoadTaskToEditor(task);
         activeID = task.id;
         
    }
});




 return listItem;

}
/*
const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
};

taskData.sort((a, b) =>
    priorityOrder[a.priority] - priorityOrder[b.priority]
);*/

taskData.sort((a, b) => b.dueDate - a.dueDate);

if(!hasRendered){
   
    taskData.forEach(element => {list.appendChild(  CreateNewSlide(element,priorityLevels,statusLevels));  })
hasRendered = true;
}


discardBtn.addEventListener("click", (event) => {
  //const updatedTask = LoadEditorToTask(existingTask);


 
  editor.className = "Hide";
  console.log("hidden");
});




saveBtn.addEventListener("click", (event) => {
  //const updatedTask = LoadEditorToTask(existingTask);

SaveTaskFromEditor();
  console.log("Task saved:", );
  
  ReloadDOM();
  editor.className = "Hide";
});


function searchTasks(searchText) {
    const term = searchText.toLowerCase().trim();
console.log(term);
    return taskDatabase
        .filter(task =>
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term)
        )
        .map(task => task.id);
}

SearchInput.addEventListener("change", (event) => {
  //const updatedTask = LoadEditorToTask(existingTask);

const searchText = SearchInput.value;
const indexes = searchTasks(searchText);
ReloadDOMWithIndexes(indexes);

indexes.forEach(element => {

    console.log(`THIS IS THE INDEX :: ${element}`)
})

});



SearchInput.addEventListener("input", (event) => {
    const searchText = event.target.value;

    const ids = searchTasks(searchText);

    ReloadDOMWithIndexes(ids);

    ids.forEach(id => {
        console.log(`THIS IS THE TASK ID :: ${id}`);
    });
});



function deleteTaskById(id) {
    taskData = taskData.filter(task => task.id !== id);
}


DeleteBtn.addEventListener("click", (event) => {
    

   deleteTaskById(activeID);
    ReloadDOM();
   editor.className = "Hide";
});



CreateBtn.addEventListener("click", (event) => {

    editor.className = "Show";

    LoadTaskToEditor(tempTask);
    ReloadDOM();
   console.log(`THIS IS THE TASK ID :: ${activeID}`);
    console.log("Delete");
   
});

