import {
	showAlertWaiting,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
} from './handlerActionGeneric.js';

function action(actionMethod, titleWaiting, titleResult, url, orderId) {
	catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting(titleWaiting);
		//restore(delete: true)
		var resultRestore = await axios({
			method: actionMethod,
			url: url,
		});

		if (resultRestore.data.status === 'success') {
			var resultRestoreNotifyOrder = await axios({
				method: 'PATCH',
				url: `/api/users/notify-orders/restore/${orderId}`,
			});
			alertWaiting.close();
			if (resultRestoreNotifyOrder.data.status === 'success') {
				await showAlertSuccess(`${titleResult}`, 'Page will automatically reloaded');
				location.reload();
			}
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
			var orderId = $(this).data('id');
			action(
				'PATCH',
				'Order is being processed(restore)',
				'Restore Order successfully!',
				`/admin/orders/restore/${orderId}`,
				orderId
			);
		}
	});
});
