import {
	showAlertWaiting,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
} from './handlerActionGeneric.js';

function action(actionMethod, titleWaiting, titleResult, url, data) {
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting(titleWaiting);
		//restore(delete: true)
		var resultRestore = await axios({
			method: actionMethod,
			url: url,
			data: data,
		});

		if (resultRestore.data.status === 'success') {
			alertWaiting.close();
			await showAlertSuccess(`${titleResult}`, 'Page will automatically reloaded');
			location.reload();
		}
	});
}
var btnRestore = $('.btnRestore');
btnRestore.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction(
		`Order - ${$(this).data('id')} - TotalPayment: ${$(this).data('total')}`,
		'Are you sure? (this action will restore this order)'
	).then((result) => {
		if (result.isConfirmed) {
			var idOrder = $(this).data('id');
			action(
				'PATCH',
				'Order is being processed(restore)',
				'Restore Order successfully!',
				`/admin/orders/restore/${idOrder}`
			);
		}
	});
});
