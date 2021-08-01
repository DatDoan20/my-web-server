import { Validator } from './formValidator.js';
var singInForm = new Validator('#singIn-form');
const singIn = async (formData) => {
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/users/sign-in-admin',
			data: formData,
		});
		if (res.data.status === 'success') {
			await Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'You SingIn successfully',
				showConfirmButton: false,
				timer: 1500,
			});
			await location.assign('/admin/dashboard');
		}
	} catch (err) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Incorrect phone or password',
			footer: '<a href="">You forgot password?</a>',
		});
	}
};
singInForm.onSingIn = function (formData) {
	singIn(formData);
};
