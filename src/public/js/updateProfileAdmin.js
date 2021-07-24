async function showAlert(icon, title, text) {
	await Swal.fire({
		position: 'center',
		icon: icon,
		title: title,
		text: text,
		showConfirmButton: false,
		timer: 1500,
	});
}
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
		await showAlert('error', 'Oops...!', 'New password and confirm password not the same! 😫');
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
	var resultUpdate;
	try {
		const alertWaiting = Swal.fire({
			title: 'Profile is being updated..., Please wait a moment, Do not dismiss!',
			icon: 'warning',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
			closeOnClickOutside: false,
		});
		//default when click -> update me (update info basic) + avatar
		resultUpdate = await axios({
			method: 'PATCH',
			url: 'http://127.0.0.1:3000/api/users/update-me',
			data: formData,
		});
		//if check change password -> update password
		if (document.getElementById('chk-change-password').checked) {
			resultUpdate = await axios({
				method: 'PATCH',
				url: 'http://127.0.0.1:3000/api/users/update-password',
				data: formData,
			});
		}
		if (resultUpdate.data.status === 'success') {
			alertWaiting.close();
			await showAlert('success', 'Update successfully!', 'Page will automatically reloaded');
			location.reload();
		}
	} catch (err) {
		await showAlert('error', 'Oops...!', 'Something went wrong!, please try again later.');
		location.reload();
	}
});
