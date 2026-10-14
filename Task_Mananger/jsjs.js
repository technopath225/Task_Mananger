


console.log("this works");

const list = document.getElementById("taskList");
const taskObj= {
    id:2,
title:"THE SOFTWARE",
createdDate:"2026-O9-18",
dueDate:"20-10-2026",
priority:"Medium",
status:"Completed",


}



let priorityLevels = ["Low","Medium","High"];
let statusLevels = ["Pending","Initialised","In Progress","Completed"];

const DateLeft = (dateAsString) => {


}


function daysUntilDue(dateString) 
    {
    const [day, month, year] = dateString.split("-").map(Number);

  const dueDate = new Date(year, month - 1, day);
  const today = new Date();

  // Reset time to midnight
  today.setHours(0, 0, 0, 0);
console.log(dueDate)
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
    plevel.id = index;
    parent.appendChild(plevel);

}

const CreateNewSlide = (task,prioLevels,statLevels) => {

 let listItem = document.createElement("li");
  let slide = document.createElement("div");
 let slideUpperLeft = document.createElement("div");
 let title = document.createElement("div");
  let dueSection = document.createElement("div");
let due = document.createElement("div");
let date = document.createElement("div");


let  upperRightSection = document.createElement("div");
let slideUpperMiddle= document.createElement("div");
let priorityTitle = document.createElement("div");
const priority = document.createElement("select");


let slideUpperRight = document.createElement("div");
let statusTitle = document.createElement("div");
const status = document.createElement("select");

upperRightSection.className = "UpperRightSection";
slideUpperMiddle.className = "SlideUpperMiddle";
priorityTitle.className = "OptionsNames";
priority.className = "Options";

slideUpperRight.className = "SlideUpperRight";
statusTitle.className = "OptionsNames";
status.className="Options";

prioLevels.forEach((element,index) => {
    CreateOptions(element,priority,index);
    console.log(element);
});

statLevels.forEach((element,index) => {
    CreateOptions(element,status,index);
    console.log(element);
});

priority.value = task.priority;
status.value = task.status;
priorityTitle.appendChild(priority);
slideUpperMiddle.appendChild(priorityTitle);
upperRightSection.appendChild(slideUpperMiddle);


slideUpperRight.className = "SlideUpperRight";
statusTitle.className = "OptionsNames";
status.className="Options";

slideUpperRight.appendChild(statusTitle);
slideUpperRight.appendChild(status);
upperRightSection.appendChild(slideUpperRight);

date.className = "Date"
date.textContent= task.dueDate;
dueSection.className="DueSection";
due.className="Due";

let daysleft = daysUntilDue(task.dueDate); 
console.log(daysleft);
due.textContent = `Due in ${daysleft} days`;
title.className = "Title";
title.textContent = taskObj.title;
slide.className = "Slide";

slideUpperLeft.className = "slideUpperLeft";


dueSection.appendChild(due);
dueSection.appendChild(date);
slideUpperLeft.appendChild(title);
slideUpperLeft.appendChild(dueSection);


slide.appendChild(slideUpperLeft);
slide.appendChild(upperRightSection);
listItem.appendChild(slide);

 return listItem;

}


//list.appendChild(  CreateNewSlide(taskObj,priorityLevels,statusLevels));  

