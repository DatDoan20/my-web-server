import {
	showAlertWaiting,
	showAlertSuccess,
	catchAsyncAction,
	showAlertWarning,
} from './handlerActionGeneric.js';
import { capitalize } from './handleString.js';
import { EventCategoryAndType } from './handleCategoryAndTypeProduct.js';

//handle category and type list
EventCategoryAndType();

const infoFormProduct = document.querySelector('.form-info-product-add');

//set Event, POST use URLSearchParams/ PATCH use FormData to upload image
infoFormProduct.addEventListener('submit', async (e) => {
	e.preventDefault();
	const color = document.getElementById('color').value.replace(/\s+/g, '').trim();
	const size = document.getElementById('size').value.replace(/\s+/g, '').trim();
	const category = $('#category').val();
	const type = $('#type').val();
	const name = capitalize(document.getElementById('name').value.trim());
	const description = capitalize(document.getElementById('description').value.trim());
	const material = capitalize(document.getElementById('material').value.trim());
	const pattern = capitalize(document.getElementById('pattern').value.trim());
	var formData = new URLSearchParams();
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

	//defined outOfStock: true/false
	if (document.getElementById('rdoAvailable').checked) {
		formData.append('outOfStock', false);
	} else {
		formData.append('outOfStock', true);
	}

	//Ok create product
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting('Product is being added');
		//(1)create product
		var resultCreate = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/products',
			data: formData,
		});

		// (2)create success -> upload image for that product
		if (resultCreate.data.status === 'success') {
			var idProduct = resultCreate.data.data._id;
			var formDataUploadSecond = new FormData();

			// (2.1)check and add imageCover
			if (document.getElementById('imageCover').files.length > 0) {
				formDataUploadSecond.append(
					'imageCover',
					document.getElementById('imageCover').files[0]
				);
			}

			// (2.2) check and add images
			if (document.getElementById('images').files.length > 0) {
				var numberFileOfImages = document.getElementById('images').files.length;

				for (var index = 0; index < numberFileOfImages; index++) {
					formDataUploadSecond.append(
						'images',
						document.getElementById('images').files[index]
					);
				}
			}

			// (2.3) upload
			if (formDataUploadSecond.has('imageCover') || formDataUploadSecond.has('images')) {
				var resultUpImage = await axios({
					method: 'PATCH',
					url: `http://127.0.0.1:3000/api/products/${idProduct}`,
					data: formDataUploadSecond,
				});
				alertWaiting.close();
				if (resultUpImage.data.status === 'success') {
					await showAlertSuccess(
						'Create product successfully!',
						'Page will automatically reloaded'
					);
					location.reload();
				}
			} else {
				alertWaiting.close();
				showAlertWarning(
					'WARNING',
					'Created product has not any image, please add image later 😥'
				);
			}
		}
	});
});
