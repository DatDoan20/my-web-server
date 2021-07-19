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

function showAlertConfirmAction(idOrder, price, title) {
	return Swal.fire({
		title: `Are you sure? (this action will ${title} this order)`,
		text: `Order - ${idOrder} - TotalPayment: ${price}`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: `Yes, ${title} it!`,
	});
}

async function action(actionMethod, titleWaiting, titleResult, url, data) {
	try {
		const alertWaiting = Swal.fire({
			title: `${titleWaiting}..., Please wait a moment, Do not dismiss!`,
			icon: 'warning',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
			closeOnClickOutside: false,
		});
		resultUpdate = await axios({
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
		await showAlertResult(
			'error',
			'Oops...!',
			'Something went wrong!, please try again later.'
		);
	}
}
var btnRestore = $('.btnRestore');
btnRestore.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction($(this).data('id'), $(this).data('total'), 'restore').then((result) => {
		if (result.isConfirmed) {
			action(
				'PATCH',
				'Order is being processed(restore)',
				'Restore Order successfully!',
				`http://127.0.0.1:3000/admin/orders/restore/${$(this).data('id')}`
			);
		}
	});
});
