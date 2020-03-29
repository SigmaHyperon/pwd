async function getPwdList(filter){
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(filter)
	};
	const res = await fetch('/pwd',options);
	return res.json();
}

async function addPwd(data){
	const options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(data)
	};
	return fetch('/pwd',options);
}

function getFilterSettings(){
	const arr = [];
	$("#filter input").each((index, element) => {
		const id = $(element).attr("id");
		const val = $(element).val();
		if(val !== ""){
			arr.push([ id, val ]);
		}
	});
	return Object.fromEntries(arr);
}

function showPasswords(list){
	clearList();
	list.forEach(v =>{
		const str = `<tr><td>${v.service}</td><td>${v.userName}</td><td>${v.eMail}</td><td>${v.password}</td></tr>`;
		$("#list").append(str);
	})
}

function clearList(){
	$("#list").children().remove();
}

async function updateList(){
	const filter = getFilterSettings();
	const passwords = await getPwdList(filter);
	showPasswords(passwords);
}

function showAlert(type, text){
	const alertText = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
		${text}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
  	</div>`;
	const alert = $(alertText).appendTo("#alert-box");
	setTimeout(() => {$(alert).alert('close')}, 5000);
}
$(() => {
	$("#filter input").on("input", async (e) => {
		updateList();
	});
	$('#addPopup').on('shown.bs.modal', function () {
		$('#pService').trigger('focus');
	});
	$('#modal-add-button').on('click', function () {
		$("#modal-add-form").submit();
	});
	$("#modal-add-form").on("submit", async (e) => {
		e.preventDefault();
		let putData = $(e.target).serializeArray();
		putData = putData.map(v => {
			const {name, value} = v;
			return [name, value];
		});
		putData = Object.fromEntries(putData);
		const result = await addPwd(putData);
		if( result.ok ) {
			showAlert("success", "New entry successfully created");
		} else {
			const errorMsg = (await result.json()).error;
			showAlert("danger", `Error while creating new entry:<br>${errorMsg}`);
		}
		$('#addPopup').modal('hide');
		updateList();
	});
	updateList();
});