const addForm = document.querySelector('#add-form')
const itemName = document.querySelector('input#item-name');
const items = document.querySelector('#items');
const op = document.querySelector('#op');

itemName.focus();

const submitForm = function (event) {
	event.preventDefault();

	if (op.value === 'add') {
		// return for empty
		if (!itemName.value) return;
		
		// create li
		const li = document.createElement('li');
		li.id = Date.now();
		const date = (new Date).toString();
		li.innerHTML = `<span class="text">${itemName.value}</span><span class="date">Posted at: ${date.slice(15,24) + ' on ' +date.slice(4,15)}</span>`;
		
		li.innerHTML += `<a href="#" id="strike-${li.id}" class="btn-strike" data-done="no">done</a><a href="#" id="edit-${li.id}" class="btn-edit">edit</a><a href="#" id="delete-${li.id}" class="btn-delete">delete</a>`;
		items.appendChild(li);
		itemName.value = "";
	} else if (op.value === 'edit') {
		const li = items.querySelector(`li[id*="${op.getAttribute('data-item_id')}"]`);
		li.querySelector('.text').textContent = itemName.value;
		itemName.value=""
		op.value = "add"
		
		li.classList.remove('edit-item')
		op.setAttribute('data-item_id', '');
		document.querySelector('#btn-submit').textContent = 'Add';
	}

}

const resetItems = function (event) {
	event.preventDefault();
	items.innerHTML && window.confirm('Reset all items?') && (items.innerHTML = '');
}

document.querySelector('#btn-reset').addEventListener('click', resetItems);

addForm.addEventListener('submit', submitForm);

const markItemDone = function (e) {
	const isDone = e.target.getAttribute('data-done') === 'yes';
	if (!isDone) {
		e.target.parentNode.querySelector('.text').style.cssText = 'text-decoration:line-through;color:#999;'
		e.target.textContent = 'undone';
		e.target.parentNode.classList.add('done-item');
		e.target.setAttribute('data-done', 'yes');
	} else {
		e.target.parentNode.querySelector('.text').style.cssText = 'text-decoration:unset;color:unset;';
		e.target.textContent = 'done';
		e.target.parentNode.classList.remove('done-item');
		e.target.setAttribute('data-done', 'no');
	}
}

const editItem = function (e) {
	document.querySelector('#btn-submit').textContent = 'Update';
	e.target.parentNode.classList.add('edit-item');
	op.value = "edit"
	op.setAttribute('data-item_id', e.target.parentNode.id);
	itemName.value = e.target.parentNode.querySelector('.text').textContent;
	itemName.focus();
}

const deleteItem = function (e) {
	const item = e.target.parentNode;
	// if item is being edited then return
	if (parseInt(op.getAttribute('data-item_id')) === parseInt(item.id)) {
		alert('Error! This item is being edited')
		return;
	};
	item && item.remove();
} 

// Options for the observer (which mutations to observe)
const config = { childList: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
		if (mutation.addedNodes.length) {
			const node = mutation.addedNodes[0];
			const btnStrike = node.querySelector('.btn-strike');
			const btnEdit = node.querySelector('.btn-edit');
			const btnDelete = node.querySelector('.btn-delete');
			btnStrike.addEventListener('click', e => {
				markItemDone(e);
				observer.disconnect();
			})
			btnEdit.addEventListener('click', e => {
				editItem(e);
				observer.disconnect();
			})
			btnDelete.addEventListener('click', e => {
				deleteItem(e);
				observer.disconnect();
			})
		}
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(items, config);