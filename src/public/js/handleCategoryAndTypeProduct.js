import { typeNu, typeNam, typeNamNu } from './dynamicCodeHTML.js';

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
	} else if (crrValueCategory === 'nu') {
		$(idType).append(typeNu);
	} else {
		$(idType).append(typeNamNu);
	}
}
export function EventCategoryAndType() {
	$('#category').on('change', function () {
		$('#type').html('');
		if ($(this).val() === 'nam') {
			$('#type').append(typeNam);
		} else if ($(this).val() === 'nu') {
			$('#type').append(typeNu);
		} else {
			$('#type').append(typeNamNu);
		}
	});
}
