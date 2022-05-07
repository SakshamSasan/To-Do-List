
var parent = document.getElementById('parent');
var tasknum = document.getElementById('numCompletion');

var doneSymbol;
var cans;

async function initialise() {

	let response = await fetch('https://jsonplaceholder.typicode.com/todos')
	let obj = await response.json()
	obj.splice(2)
	addTask1(obj)
}
initialise();

async function deletefromAPI() {
	try{
		let response = await fetch(`https://jsonplaceholder.typicode.com/todos/201`, {
	  		method: 'DELETE',
		});
		let answer = await response.json()
		console.log(answer)

		
	}
	catch(error){

		console.log(`There was some error in our database: ${error}`)

	}
	
}




//event for completing a task

function Completion(e) {

	this.style.backgroundColor='green'
	setTimeout(vanish.bind(e.target),300)
	function vanish() {
		let value = this.getAttribute('data-id')
		document.getElementById(value).remove()
		let org = tasknum.innerHTML;
		tasknum.innerHTML=String(parseInt(org)+1);
		deletefromAPI(value);
	}
	

}
//Event for deleting a task

function deleteTask() {
	let value = this.getAttribute('data-id');
	document.getElementById(value).remove();
	deletefromAPI(value);
}



//Used scaling intelligently as item still on DOM even if not visible

var addTaskIcon = document.getElementById('add-task-icon')
let myDiv = document.getElementById('myDiv');
let addButton = document.getElementById('click-to-add') ;
let cancelButton = document.getElementById('click-to-cancel');
addTaskIcon.addEventListener('click',takeInputForm)
cancelButton.addEventListener('click',goOriginal)
addButton.addEventListener('click',addTask2);

function takeInputForm() {
	this.style.display='none';
	myDiv.style.transform='scale(1)';
}

function goOriginal() {
	addTaskIcon.style.display='block';
	myDiv.style.transform='scale(0)';
}

// functions to initialise from API and  task on screen and post in API

function addTask1(arr) {
	for(let i = 0; i<arr.length;i++) {
		if(arr[i].completed==true){
			continue;
		}
		else{
			let newdiv = document.createElement('div')
			newdiv.setAttribute('id',arr[i].id)
			newdiv.classList.add('col-10','col-md-6', 'offset-1','offset-md-3','rounded','bg-light', 'task', 'py-2', 'px-1', 'my-3');
			newdiv.innerHTML=`<div class="row w-100 h-100">
				<div class="col-1 d-flex align-items-center px-3 h-100">
					<div class="done" data-id="${arr[i].id}"></div>
				</div>
				<div class="col-9">
					<p class="d-inline" ><b>${arr[i].title} (From API)</b></p>
					<br>
					<i class="time-date">ASAP</i>
				</div>
				<div data-id="${arr[i].id}" class="col-1 d-flex align-items-center justify-content-end trash h-100 m-0">
					<i class="fa-solid fa-trash-can"></i>
				</div>
				</div>`

			parent.appendChild(newdiv)

		}
	}
	//Reinitialising the doneSymbol divs as new DOM changes are made
	doneSymbol = document.getElementsByClassName('done');
	for(let ele of doneSymbol){
		ele.addEventListener('click',Completion)
	}
	//Reinitialising the trash cans variable as new DOM elements added
	var cans = document.getElementsByClassName('trash')
	for(let ele of cans){
		ele.addEventListener('click',deleteTask)
	}
}

 async function addTask2() {


	let input1val = document.getElementById('taskname').value
	let input2val = document.getElementById('tasktime').value

	if(input1val==null || input1val=="" || input2val==null || input2val=="") {
		alert('A unique task name and time is necessary');
		return;
	}

	let newdiv = document.createElement('div')

	newdiv.setAttribute('id',input1val+input2val)
	newdiv.classList.add('col-10','col-md-6', 'offset-1','offset-md-3','rounded','bg-light', 'task', 'py-2', 'px-1', 'my-3');
	newdiv.innerHTML=`
			
			<div class="row w-100 h-100">
				<div class="col-1 d-flex align-items-center px-3 h-100">
					<div class="done" data-id='${input1val+input2val}'></div>
				</div>
				<div class="col-9">
					<p class="d-inline" ><b>${input1val}</b></p>
					<br>
					<i class="time-date">${input2val}</i>
				</div>
				<div class="col-1 d-flex align-items-center justify-content-end trash h-100 m-0" data-id="${input1val+input2val}">
					<i class="fa-solid fa-trash-can"></i>
				</div>
				</div>

			`
	parent.appendChild(newdiv);

	//Reinitialising the doneSymbol divs as new DOM changes are made
	doneSymbol = document.getElementsByClassName('done');
	for(let ele of doneSymbol){
		ele.addEventListener('click',Completion)
	}
	//Reinitialising the trash cans variable as new DOM elements added
	var cans = document.getElementsByClassName('trash')
	for(let ele of cans){
		ele.addEventListener('click',deleteTask)
	}	
	goOriginal();
	let obj = {}
	obj["userId"] = 1;
	obj["id"] = input1val+input2val;
	obj["title"] = input1val;
	
	//Now we will add to API using await in front of things that are promises 
	try{
		let response = await fetch('https://jsonplaceholder.typicode.com/todos',{
  							method: 'POST',
  							body: JSON.stringify({obj}),
  							headers: {
    						'Content-type': 'application/json; charset=UTF-8',
  							},
						});
		let resolved = await response.json();
		console.log(resolved)
	}
	catch(error) {
		alert(`There was an error in server: ${error}`)
	}
	

	
}



