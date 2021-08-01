import {
	showAlertWaiting,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
} from './handlerActionGeneric.js';

$('.name-product').hover(
	function () {
		$(this).css('text-decoration', 'underline');
		$(this).css('background-color', 'black');
	},
	function () {
		$(this).css('text-decoration', 'none');
		$(this).css('background-color', 'transparent');
	}
);

var btnDelete = $('.btnDelete');
btnDelete.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction(
		$(this).data('name'),
		'Are you sure? (this action will make this product out of stock)'
	).then((result) => {
		if (result.isConfirmed) {
			deleteProduct($(this).data('id'));
		}
	});
});
function deleteProduct(id) {
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting('Deleting');
		const res = await axios({
			method: 'DELETE',
			url: `http://127.0.0.1:3000/api/products/${id}`,
		});

		if (res.data.status === 'success') {
			alertWaiting.close();
			await showAlertSuccess('Deleted!', 'Your product has been deleted.');
			location.reload();
		}
	});
}
