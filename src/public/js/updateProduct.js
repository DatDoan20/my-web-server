import {
	showAlertWaiting,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
} from './handlerActionGeneric.js';

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
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting('Product is being updated');
		resultUpdate = await axios({
			method: 'PATCH',
			url: `http://127.0.0.1:3000/api/products/${$('#submit').data('id')}`,
			data: formData,
		});
		if (resultUpdate.data.status === 'success') {
			alertWaiting.close();
			await showAlertSuccess('Update successfully!', 'Page will automatically reloaded');
			location.reload();
		}
	});
});
