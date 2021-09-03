import { typeNu, typeNam } from './dynamicCodeHTML.js';

export function checkCurrentCategoryAndType() {
	const crrValueCategory = $('#category').data('category');
	const crrValueType = $('#type').data('type');

	$(`select[name=category] option[value=${crrValueCategory}]`).prop('selected', true);
	loadListType('#type', crrValueCategory);
	$(`select[name=type] option[value=${crrValueType}]`).prop('selected', true);
}
function loadListType(idType, crrValueCategory) {
	$(idType).html('');
	if (crrValueCategory === 'nam') {
		$(idType).append(typeNam);
	} else {
		$(idType).append(typeNu);
	}
}
export function EventCategoryAndType() {
	$('#category').on('change', function () {
		$('#type').html('');
		if ($(this).val() === 'nam') {
			$('#type').append(typeNam);
		} else {
			$('#type').append(typeNu);
		}
	});
}
