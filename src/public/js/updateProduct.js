import {
	showAlertWaiting,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
} from './handlerActionGeneric.js';

import {
	EventCategoryAndType,
	checkCurrentCategoryAndType,
} from './handleCategoryAndTypeProduct.js';
import { capitalize } from './handleString.js';

//handle category and type list
EventCategoryAndType();
checkCurrentCategoryAndType();

// form
const infoFormProduct = document.querySelector('.form-info-product-update');
//set Event, POST use URLSEARCHPARAMS/ PATCH use FORMDATA to upload image
infoFormProduct.addEventListener('submit', async (e) => {
	e.preventDefault();
	const color = document.getElementById('color').value.replace(/\s+/g, ' ').trim();
	const size = document.getElementById('size').value.replace(/\s+/g, ' ').trim();
	const category = $('#category').val();
	const type = $('#type').val();
	const name = capitalize(document.getElementById('name').value.trim());
	const description = capitalize(document.getElementById('description').value.trim());
	const material = capitalize(document.getElementById('material').value.trim());
	const pattern = capitalize(document.getElementById('pattern').value.trim());
	var formData = new FormData();
	formData.append('name', name);
	formData.append('description', description);
	formData.append('price', document.getElementById('price').value.trim());
	formData.append('brand', document.getElementById('brand').value.trim());
	formData.append('material', material);
	formData.append('pattern', pattern);
	formData.append('discount', document.getElementById('discount').value.trim());
	formData.append('type', type);
	formData.append('category', category);
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
			url: `/api/products/${$('#submit').data('id')}`,
			data: formData,
		});
		if (resultUpdate.data.status === 'success') {
			alertWaiting.close();
			await showAlertSuccess('Update successfully!', 'Page will automatically reloaded');
			location.reload();
		}
	});
});
