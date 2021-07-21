async function showAlertResult(icon, title, text) {
	await Swal.fire({
		position: 'center',
		icon: icon,
		title: title,
		text: text,
		showConfirmButton: false,
		timer: 1500,
	});
}

function showAlertConfirmAction(idOrder, totalPaymentOrder, title) {
	return Swal.fire({
		title: `Are you sure? (this action will ${title} this order)`,
		text: `Order - ${idOrder} - TotalPayment: ${totalPaymentOrder}`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: `Yes, ${title} it!`,
	});
}

async function actionOrder(actionMethod, titleWaiting, titleResult, url, data) {
	try {
		const alertWaiting = Swal.fire({
			title: `${titleWaiting}..., Please wait a moment, Do not dismiss!`,
			icon: 'warning',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
			closeOnClickOutside: false,
		});
		var resultUpdate = await axios({
			method: actionMethod,
			url: url,
			data: data,
		});
		if (resultUpdate.data.status === 'success') {
			alertWaiting.close();
			await showAlertResult('success', `${titleResult}`, 'Page will automatically reloaded');
			location.reload();
		}
	} catch (err) {
		console.log(err);
		await showAlertResult(
			'error',
			'Oops...!',
			'Something went wrong!, please try again later.'
		);
		location.reload();
	}
}
var btnAccept = $('.btnAccept');
btnAccept.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction($(this).data('id'), $(this).data('total'), 'accept').then((result) => {
		if (result.isConfirmed) {
			actionOrder(
				'PATCH',
				'Order is being processed(accepted)',
				'Accepted Order successfully!',
				`http://127.0.0.1:3000/admin/orders/accept/${$(this).data('id')}`
			);
		}
	});
});

var btnCancel = $('.btnCancel');
btnCancel.click(function (e) {
	e.preventDefault();

	showAlertConfirmAction($(this).data('id'), $(this).data('total'), 'delete').then(
		async (result) => {
			if (result.isConfirmed) {
				//update state -> canceled -> delete soft
				var resultCancel = await axios({
					method: 'PATCH',
					url: `http://127.0.0.1:3000/admin/orders/cancel/${$(this).data('id')}`,
				});
				if (resultCancel.data.status === 'success') {
					actionOrder(
						'DELETE',
						'Order is being Cancel(delete)',
						'Canceled Order successfully!, You can check in Bin late. 🗑️',
						`http://127.0.0.1:3000/admin/${$(this).data('id')}/soft`
					);
				}
			}
		}
	);
});
