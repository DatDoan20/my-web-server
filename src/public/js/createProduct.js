async function showAlert(icon, title, text, value) {
	await Swal.fire({
		position: 'center',
		icon: icon,
		title: title,
		text: text,
		showConfirmButton: value,
		timer: 1500,
	});
}
const infoFormProduct = document.querySelector('.form-info-product-add');
//set Event, USE UPLOAD IMAGE WITH POST, NOT USE FORMDATA UP LOAD IMAGE WITH POST, OBJECT NORMAL CAN NOT UPLOAD IMAGE
infoFormProduct.addEventListener('submit', async (e) => {
	e.preventDefault();
	const color = document.getElementById('color').value.replace(/\s+/g, ' ').trim();
	const size = document.getElementById('size').value.replace(/\s+/g, ' ').trim();
	var formData = new URLSearchParams();
	formData.append('name', document.getElementById('name').value.trim());
	formData.append('description', document.getElementById('description').value.trim());
	formData.append('price', document.getElementById('price').value.trim());
	formData.append('brand', document.getElementById('brand').value.trim());
	formData.append('material', document.getElementById('material').value.trim());
	formData.append('pattern', document.getElementById('pattern').value.trim());
	formData.append('discount', document.getElementById('discount').value.trim());
	formData.append('type', document.getElementById('type').value.trim());
	formData.append('category', document.getElementById('category').value.trim());
	formData.append('color', color);
	formData.append('size', size);

	//defined outOfStock: true/false
	if (document.getElementById('rdoAvailable').checked) {
		formData.append('outOfStock', false);
	} else {
		formData.append('outOfStock', true);
	}

	//Ok create product, then check if it's have img... -> update that product + it's images
	var resultCreate;
	try {
		const alertWaiting = Swal.fire({
			title: 'Product is being added..., Please wait a moment, Do not dismiss!',
			icon: 'warning',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
			closeOnClickOutside: false,
		});
		resultCreate = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/products',
			data: formData,
		});

		//updateload image if product create success
		if (resultCreate.data.status === 'success') {
			//create product success -> upload image
			var idProduct = resultCreate.data.data._id;
			var formDataUploadSecond = new FormData();
			//add imageCover
			if (document.getElementById('imageCover').files.length > 0) {
				formDataUploadSecond.append(
					'imageCover',
					document.getElementById('imageCover').files[0]
				);
			}
			//add images
			if (document.getElementById('images').files.length > 0) {
				var numberFileOfImages = document.getElementById('images').files.length;

				for (var index = 0; index < numberFileOfImages; index++) {
					formDataUploadSecond.append(
						'images',
						document.getElementById('images').files[index]
					);
				}
			}
			if (formDataUploadSecond.has('imageCover') || formDataUploadSecond.has('images')) {
				resultUpImage = await axios({
					method: 'PATCH',
					url: `http://127.0.0.1:3000/api/products/${idProduct}`,
					data: formDataUploadSecond,
				});
				if (resultUpImage.data.status === 'success') {
					alertWaiting.close();
					await showAlert(
						'success',
						'Create product successfully!',
						'Page will automatically reloaded',
						false
					);
				}
			} else {
				alertWaiting.close();
				await Swal.fire({
					position: 'center',
					icon: 'warning',
					title: 'WARNING',
					text: '⚠️⚡Create product was missing images⚡⚠️, please update product with image later 😥',
					showConfirmButton: true,
				});
			}
			location.reload();
		}
	} catch (err) {
		console.log(err);
		await showAlert(
			'error',
			'Oops...!',
			'Something went wrong!, please try again later.',
			false
		);
		location.reload();
	}
});
