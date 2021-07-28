export const showAlertConfirmAction = (text, title) => {
	return Swal.fire({
		title: title,
		text: text,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: `Yes, do it!`,
	});
};

export const showAlertWaiting = (titleWaiting) => {
	return Swal.fire({
		title: `${titleWaiting}..., Please wait a moment, Do not dismiss!`,
		icon: 'warning',
		showConfirmButton: false,
		allowOutsideClick: false,
		allowEscapeKey: false,
		closeOnClickOutside: false,
	});
};

export const showAlertSuccess = async (title, text) => {
	await Swal.fire({
		position: 'center',
		icon: 'success',
		title: title,
		text: text,
		showConfirmButton: false,
		timer: 1500,
	});
};

export const showAlertFail = (title, text) => {
	return Swal.fire({
		position: 'center',
		title: title,
		text: text,
		icon: 'error',
		showConfirmButton: true,
	});
};
