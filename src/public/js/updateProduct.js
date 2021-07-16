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
const infoFormProduct = document.querySelector('.form-info-product');
//set Event
infoFormProduct.addEventListener('submit', async (e) => {
	e.preventDefault();
	const color = document.getElementById('color').value.replace(/\s+/g, ' ').trim();
	const size = document.getElementById('size').value.replace(/\s+/g, ' ').trim();
	var formData = new FormData();
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

	//defined sex property
	if (document.getElementById('rdoAvailable').checked) {
		formData.append('outOfStock', false);
	} else {
		formData.append('outOfStock', true);
	}
	//add imageCover
	if (document.getElementById('imageCover').files.length > 0) {
		formData.append('imageCover', document.getElementById('imageCover').files[0]);
	}
	//add images
	if (document.getElementById('images').files.length > 0) {
		var numberFileOfImages = document.getElementById('images').files.length;

		for (var index = 0; index < numberFileOfImages; index++) {
			formData.append('images', document.getElementById('images').files[index]);
		}
	}
	//Ok update here
	var resultUpdate;
	try {
		//default when click -> update me (update info basic) + avatar
		//var idProduct = document.getElementById('testIdProduct').value;
		//console.log(idProduct);
		resultUpdate = await axios({
			method: 'PATCH',
			url: `http://127.0.0.1:3000/api/products/60dfbae36811c50618f6b101`,
			data: formData,
		});
		if (resultUpdate.data.status === 'success') {
			await showAlert('success', 'Update successfully!', 'Page will automatically reloaded');
			location.reload();
		}
	} catch (err) {
		await showAlert('error', 'Oops...!', 'Something went wrong!, please try again later.');
		location.reload();
	}
});
