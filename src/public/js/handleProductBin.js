import {
	showAlertWaiting,
	showAlertSuccess,
	catchAsyncAction,
	showAlertConfirmAction,
} from './handlerActionGeneric.js';

function handleRestore(productId) {
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting('Product is being processed(restore)');
		var resultUpdate = await axios({
			method: 'PATCH',
			url: `/api/products/restore/${productId}`,
		});
		if (resultUpdate.data.status === 'success') {
			alertWaiting.close();
			await showAlertSuccess(`Restore successfully!`, 'Page will automatically reloaded');
			location.reload();
		}
	});
}
function handleDestroy(productId) {
	//delete force product + delete all file img of that product
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting('Product is being Deleting');
		var resultDestroy = await axios({
			method: 'DELETE',
			url: `/api/products/${productId}/force`,
		});
		if (resultDestroy.data.status === 'success') {
			alertWaiting.close();
			await showAlertSuccess(`Delete successfully!`, 'Page will automatically reloaded');
			location.reload();
		}
	});
}
var btnRestore = $('.btnRestore');
btnRestore.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction(
		`${$(this).data('name')},`,
		`Are you sure? (this action will restore this product)`
	).then((result) => {
		if (result.isConfirmed) {
			handleRestore($(this).data('id'));
		}
	});
});

var btnDelete = $('.btnDelete');
btnDelete.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction(
		`${$(this).data('name')},`,
		`Are you sure? (this action will delete this product)`
	).then((result) => {
		if (result.isConfirmed) {
			handleDestroy($(this).data('id'));
		}
	});
});
