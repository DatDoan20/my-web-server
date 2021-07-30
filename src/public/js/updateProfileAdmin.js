import {
	showAlertWaiting,
	showAlertFail,
	showAlertSuccess,
	catchAsyncAction,
} from './handlerActionGeneric.js';

$('#chk-change-password').change(function () {
	if ($(this).is(':checked')) {
		$('#password').attr('required', '');
		$('#newPassword').attr('required', '');
		$('#confirmNewPassword').attr('required', '');
	} else {
		$('#password').removeAttr('required');
		$('#newPassword').removeAttr('required');
		$('#confirmNewPassword').removeAttr('required');
	}
});

function checkTheSamePassword() {
	if (document.getElementById('chk-change-password').checked) {
		if (
			document.getElementById('newPassword').value !==
			document.getElementById('confirmNewPassword').value
		) {
			return false;
		}
	}
	return true;
}
const infoFormUser = document.querySelector('.form-info-user');
//set Event
infoFormUser.addEventListener('submit', async (e) => {
	e.preventDefault();
	if (!checkTheSamePassword()) {
		showAlertFail('Oops...!', 'New password and confirm password not the same! 😫');
		return;
	}

	//defind input
	//get properties in input + avatar if it's exist
	var formData = new FormData();
	formData.append('name', document.getElementById('name').value);
	formData.append('avatar', document.getElementById('avatar').files[0]);
	formData.append('email', document.getElementById('email').value);
	formData.append('birthYear', document.getElementById('birthYear').value);

	//defined sex property
	if (document.getElementById('rdoNam').checked) {
		formData.append('sex', 'male');
	} else {
		formData.append('sex', 'female');
	}
	//update
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting('Profile is being updated');
		//default when click -> update me (update info basic) + avatar
		var resultUpdate = await axios({
			method: 'PATCH',
			url: '/api/users/update-me',
			data: formData,
		});
		//if check change password -> update password
		if (document.getElementById('chk-change-password').checked) {
			resultUpdate = await axios({
				method: 'PATCH',
				url: '/api/users/update-password',
				data: formData,
			});
		}
		if (resultUpdate.data.status === 'success') {
			alertWaiting.close();
			await showAlertSuccess('Update successfully!', 'Page will automatically reloaded');
			location.reload();
		}
	});
});
//update profile chưa test + order chưa lam
