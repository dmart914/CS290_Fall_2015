function post_new_workout(event) {
	event.preventDefault();

	var vals = {
		name: 	document.getElementById('new_workout_name').value,
		reps: 	document.getElementById('new_workout_reps').value,
		weight: document.getElementById('new_workout_weight').value,
		date: 	document.getElementById('new_workout_date').value,
		pounds: document.getElementById('new_workout_pounds').checked,
	}

	// Transform pounds to boolean
	if (vals.pounds) { vals.pounds = 1; } 
	else { vals.pounds = 0; }

	var ajax = new XMLHttpRequest();

	// Check for errors and get data back
	ajax.onreadystatechange = function() {
		if (ajax.readyState === XMLHttpRequest.DONE) {
			if (ajax.status == 200) {
				// Get response, add to table
				var response = JSON.parse(ajax.responseText);
				var table = document.getElementById('workouts_table_body');
				var table_header = table.firstChild;

				var new_workout = document.createElement('tr');
				new_workout.setAttribute('id', 'workout_' + response[0].id);

				// name
				var workout_name = document.createElement('td');
				workout_name.setAttribute('id', 'workout_'+ response[0].id + '_name');
				workout_name.textContent = response[0].name;
				new_workout.appendChild(workout_name);

				// reps
				var workout_reps = document.createElement('td');
				workout_reps.setAttribute('id', 'workout_'+ response[0].id + '_reps');
				workout_reps.textContent = response[0].reps;
				new_workout.appendChild(workout_reps);

				// weight
				var workout_weight = document.createElement('td');
				workout_weight.setAttribute('id', 'workout_'+ response[0].id + '_weight');
				workout_weight.textContent = response[0].weight;
				new_workout.appendChild(workout_weight);

				// date
				var workout_date = document.createElement('td');
				workout_date.setAttribute('id', 'workout_'+ response[0].id + '_date');
				workout_date.textContent = response[0].date;
				new_workout.appendChild(workout_date);

				// pounds
				var workout_lbs = document.createElement('td');
				workout_lbs.setAttribute('id', 'workout_'+ response[0].id + '_pounds');
				if (response[0].lbs == 1) { workout_lbs.textContent = 'Pounds'; }
				else { workout_lbs.textContent = 'Kilograms'; }
				new_workout.appendChild(workout_lbs);

				// Buttons
				var workout_actions = document.createElement('td');
				workout_actions.setAttribute('id', 'workout_'+ response[0].id + '_actions');
				
				var edit_button = document.createElement('a');
				edit_button.className = "btn btn-info btn-sm";
				edit_button.textContent = "Edit";
				edit_button.setAttribute('onclick', 'workout_edit_form(' + response[0].id + ');');

				var del_button = document.createElement('a');
				del_button.className = "btn btn-danger btn-sm";
				del_button.textContent = "Delete";
				del_button.setAttribute('onclick', 'workout_delete(' + response[0].id + ');');

				workout_actions.appendChild(edit_button);
				workout_actions.appendChild(document.createTextNode('\u00A0\u00A0'));
				workout_actions.appendChild(del_button);

				// Add data to table
				new_workout.appendChild(workout_name);
				new_workout.appendChild(workout_reps);
				new_workout.appendChild(workout_weight);
				new_workout.appendChild(workout_date);
				new_workout.appendChild(workout_lbs);
				new_workout.appendChild(workout_actions);

				table.insertBefore(new_workout, table_header.nextSibling.nextSibling);

				// Clear data from form
				document.getElementById('new_workout_name').value = '';
				document.getElementById('new_workout_reps').value = '';
				document.getElementById('new_workout_weight').value = '';
				document.getElementById('new_workout_date').value = '';
				document.getElementById('new_workout_pounds').checked = false;


			} else {
				alert('Sorry! There was an error processing your workout submission.');
			}
		}
	}

	// Make new request
	ajax.open("POST", "/new-workout", true);
	ajax.setRequestHeader("Content-Type", "application/json");
	ajax.send(JSON.stringify(vals));

}

function workout_edit_form(workout_id) {
	var workout_data = {
		'name': document.getElementById('workout_' + workout_id + '_name').textContent,
		'reps': document.getElementById('workout_' + workout_id + '_reps').textContent,
		'weight': document.getElementById('workout_' + workout_id + '_weight').textContent,
		'date': document.getElementById('workout_' + workout_id + '_date').textContent,
		'pounds': document.getElementById('workout_' + workout_id + '_pounds').textContent

	}

	var workout_form = document.createElement('tr');
	workout_form.className = 'form-inline';
	workout_form.setAttribute('action', 'workout-edit?id=+' + workout_id);
	workout_form.setAttribute('method', 'POST');
	workout_form.setAttribute('id', 'workout_edit_' + workout_id);

	var workout_name = document.createElement('td');
	workout_name.style.width = '200px';
	workout_name.appendChild(document.createElement('label'));
	workout_name.lastChild.setAttribute('class', 'sr-only');
	workout_name.lastChild.setAttribute('for', 'workout_edit_' + workout_id + '_name');
	workout_name.lastChild.innerText = 'Name';
	workout_name.appendChild(document.createElement('input'));
	workout_name.lastChild.setAttribute('type', 'text');
	workout_name.lastChild.setAttribute('class', 'form-control');
	workout_name.lastChild.setAttribute('id', 'workout_edit_' + workout_id + '_name');
	workout_name.lastChild.setAttribute('value', workout_data.name);

	var workout_reps = document.createElement('td');
	workout_reps.style.width = '75px';
	workout_reps.appendChild(document.createElement('label'));
	workout_reps.lastChild.setAttribute('class', 'sr-only');
	workout_reps.lastChild.setAttribute('for', 'workout_edit_' + workout_id + '_reps');
	workout_reps.lastChild.innerText = 'Reps';
	workout_reps.appendChild(document.createElement('input'));
	workout_reps.lastChild.setAttribute('type', 'text');
	workout_reps.lastChild.setAttribute('class', 'form-control');
	workout_reps.lastChild.setAttribute('id', 'workout_edit_' + workout_id + '_reps');
	workout_reps.lastChild.setAttribute('value', workout_data.reps);

	var workout_weight = document.createElement('td');
	workout_weight.style.width = '75px';
	workout_weight.appendChild(document.createElement('label'));
	workout_weight.lastChild.setAttribute('class', 'sr-only');
	workout_weight.lastChild.setAttribute('for', 'workout_edit_' + workout_id + '_weight');
	workout_weight.lastChild.innerText = 'Weight';
	workout_weight.appendChild(document.createElement('input'));
	workout_weight.lastChild.setAttribute('type', 'text');
	workout_weight.lastChild.setAttribute('class', 'form-control');
	workout_weight.lastChild.setAttribute('id', 'workout_edit_' + workout_id + '_weight');
	workout_weight.lastChild.setAttribute('value', workout_data.weight);

	var workout_date = document.createElement('td');
	workout_date.style.width = '150px';
	workout_date.appendChild(document.createElement('label'));
	workout_date.lastChild.setAttribute('class', 'sr-only');
	workout_date.lastChild.setAttribute('for', 'workout_edit_' + workout_id + '_date');
	workout_date.lastChild.innerText = 'Date';
	workout_date.appendChild(document.createElement('input'));
	workout_date.lastChild.setAttribute('type', 'date');
	workout_date.lastChild.setAttribute('class', 'form-control');
	workout_date.lastChild.setAttribute('id', 'workout_edit_' + workout_id + '_date');
	workout_date.lastChild.setAttribute('value', workout_data.date);

	var workout_pounds = document.createElement('td');
	workout_pounds.appendChild(document.createElement('label'));
	workout_pounds.lastChild.setAttribute('class', 'sr-only');
	workout_pounds.lastChild.setAttribute('for', 'workout_edit_' + workout_id + '_pounds');
	workout_pounds.lastChild.innerText = 'pounds';
	workout_pounds.appendChild(document.createElement('input'));
	workout_pounds.lastChild.setAttribute('type', 'checkbox');
	workout_pounds.lastChild.setAttribute('id', 'workout_edit_' + workout_id + '_pounds');
	if (workout_data.pounds == "Pounds") { workout_pounds.lastChild.checked = true; }
	else { workout_pounds.lastChild.checked = false; }
	workout_pounds.appendChild(document.createElement('span'));
	workout_pounds.lastChild.innerText = '  Pounds?';

	var workout_actions = document.createElement('td');

	var workout_submit = document.createElement('button');
	workout_submit.setAttribute('type', 'submit');
	workout_submit.setAttribute('class', 'btn btn-primary btn-sm');
	workout_submit.setAttribute('id', 'form_button');
	workout_submit.setAttribute('onclick', 'edit_form_execute(' + workout_id + ');');
	workout_submit.textContent = 'Edit';

	var workout_cancel = document.createElement('button');
	workout_cancel.setAttribute('type', 'submit');
	workout_cancel.setAttribute('class', 'btn btn-danger btn-sm');
	workout_cancel.setAttribute('id', 'form_button');
	workout_cancel.setAttribute('onclick', 'location.reload();');
	workout_cancel.textContent = 'Cancel';

	var two_spaces = document.createElement('span');
	two_spaces.innerText = '  ';

	workout_actions.appendChild(workout_submit);
	workout_actions.appendChild(two_spaces);
	workout_actions.appendChild(workout_cancel);

	// Clear content from node
	var target = document.getElementById('workout_' + workout_id);
	while (target.firstChild) {
		// Source: http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
		target.removeChild(target.firstChild);
	}

	target.appendChild(workout_name);
	target.appendChild(workout_reps);
	target.appendChild(workout_weight);
	target.appendChild(workout_date);
	target.appendChild(workout_pounds);
	target.appendChild(workout_actions);
}

function edit_form_execute(workout_id) {
	var workout_data = {
		'name': 	document.getElementById('workout_edit_' + workout_id + '_name').value,
		'reps': 	document.getElementById('workout_edit_' + workout_id + '_reps').value,
		'weight': 	document.getElementById('workout_edit_' + workout_id + '_weight').value,
		'date': 	document.getElementById('workout_edit_' + workout_id + '_date').value,
		'pounds': 	document.getElementById('workout_edit_' + workout_id + '_pounds').checked
	}

	if (workout_data.pounds) {
		workout_data.pounds = 1;
	} else {
		workout_data.pounds = 0;
	}

	var ajax = new XMLHttpRequest();

	// Check for errors and get data back
	ajax.onreadystatechange = function() {
		if (ajax.readyState === XMLHttpRequest.DONE) {
			if (ajax.status == 200) {
				// SUCCESS
				var result = JSON.parse(ajax.responseText);

				var workout = document.createElement('tr');
				workout.setAttribute('id', 'workout_' + workout_id);

				workout.appendChild(document.createElement('td'));
				workout.lastChild.setAttribute('id', 'workout_' + workout_id + '_name');
				workout.lastChild.textContent = result[0].name;

				workout.appendChild(document.createElement('td'));
				workout.lastChild.setAttribute('id', 'workout_' + workout_id + '_reps');
				workout.lastChild.textContent = result[0].reps;

				workout.appendChild(document.createElement('td'));
				workout.lastChild.setAttribute('id', 'workout_' + workout_id + '_weight');
				workout.lastChild.textContent = result[0].weight;

				workout.appendChild(document.createElement('td'));
				workout.lastChild.setAttribute('id', 'workout_' + workout_id + '_date');
				workout.lastChild.textContent = result[0].date;

				workout.appendChild(document.createElement('td'));
				workout.lastChild.setAttribute('id', 'workout_' + workout_id + '_pounds');
				if (result[0].lbs == 1) {
					workout.lastChild.textContent = 'Pounds';
				} else {
					workout.lastChild.textContent = 'Kilograms';
				}

				workout.appendChild(document.createElement('td'));
				workout.lastChild.appendChild(document.createElement('a'));
				workout.lastChild.lastChild.setAttribute('class', 'btn btn-info btn-sm');	
				workout.lastChild.lastChild.setAttribute('onclick', 'workout_edit_form(' + workout_id + ');');
				workout.lastChild.lastChild.textContent = 'Edit';

				workout.lastChild.appendChild(document.createElement('a'));
				workout.lastChild.lastChild.setAttribute('class', 'btn btn-danger btn-sm');	
				workout.lastChild.lastChild.setAttribute('onclick', 'workout_delete(' + workout_id + ');');
				workout.lastChild.lastChild.textContent = 'Delete';
				
				// Delete the data from the form
				var target = document.getElementById('workout_' + workout_id);
				var after_target = target.nextSibling;

				while(target.firstChild) {
					target.removeChild(target.firstChild);
				}

				var table = document.getElementById('workouts_table_body');
				table.insertBefore(workout, after_target);
				table.removeChild(target);	

			} else {
				alert('Sorry! Your workout edits couldn\'t be saved.');
			}
		}
	}

	// Make new request
	ajax.open("POST", "/workout-edit?id=" + workout_id, true);
	ajax.setRequestHeader("Content-Type", "application/json");
	ajax.send(JSON.stringify(workout_data));
}


function workout_delete(workout_id) {
	if (window.confirm("Are you sure you want to delete this workout?")) {
		var ajax = new XMLHttpRequest();

		ajax.onreadystatechange = function() {
			if (ajax.readyState === XMLHttpRequest.DONE) {
				if (ajax.status == 200) {
					var target = document.getElementById('workout_' + workout_id);
					var parent = document.getElementById('workouts_table_body');

					parent.removeChild(target);
				}
			}
		}

		ajax.open("DELETE", "/workout-delete?id=" + workout_id, true);
		ajax.setRequestHeader("Content-Type", "application/json");
		ajax.send();
	}
}




// Listen for form_button submission
document.getElementById("form_button").addEventListener(
	'click', post_new_workout, false);


