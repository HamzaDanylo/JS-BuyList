let state = JSON.parse(localStorage.getItem('buyList')) || [
    { id: 1, name: 'Помідори', count: 2, isBought: true },
    { id: 2, name: 'Печиво', count: 2, isBought: false },
    { id: 3, name: 'Сир', count: 1, isBought: false }
];

function saveAndRender() {
    localStorage.setItem('buyList', JSON.stringify(state)); 
    renderList();
    renderStats();
}

function renderList() {
    const leftColumn = document.querySelector('.column-left');
    
    const oldItems = leftColumn.querySelectorAll('.list-row:not(:first-child)');
    oldItems.forEach(item => item.remove());

    state.forEach(item => {
        const row = document.createElement('div');
        row.className = 'list-row';
        row.dataset.id = item.id; 

        if (item.isBought) {
            row.innerHTML = `
                <div class="item-name" style="text-decoration: line-through;">${item.name}</div>
                <div class="item-controls">
                    <span class="item-count">${item.count}</span>
                </div>
                <div class="item-actions">
                    <button class="btn-status disabled" data-action="toggle">Не куплено</button>
                </div>
            `;
        } else {
            const minusDisabled = item.count === 1 ? 'disabled' : '';
            const minusFaded = item.count === 1 ? 'faded' : '';

            row.innerHTML = `
                <div class="item-name" data-action="edit" data-tooltip="Клікніть, щоб змінити">${item.name}</div>
                <div class="item-controls">
                    <button class="btn-circle btn-minus ${minusFaded}" data-action="minus" ${minusDisabled}>&minus;</button>
                    <span class="item-count">${item.count}</span>
                    <button class="btn-circle btn-plus" data-action="plus">+</button>
                </div>
                <div class="item-actions">
                    <button class="btn-status" data-action="toggle">Куплено</button>
                    <button class="btn-delete" data-action="delete">&times;</button>
                </div>
            `;
        }
        leftColumn.append(row);
    });
}

function renderStats() {
    const leftList = document.querySelectorAll('.tag-list')[0]; 
    const boughtList = document.querySelectorAll('.tag-list')[1]; 

    leftList.innerHTML = '';
    boughtList.innerHTML = '';

    state.forEach(item => {
        const tagHTML = `<div class="tag ${item.isBought ? 'bought' : ''}">${item.name} <span class="tag-count">${item.count}</span></div>`;
        
        if (item.isBought) {
            boughtList.innerHTML += tagHTML;
        } else {
            leftList.innerHTML += tagHTML;
        }
    });
}

const inputField = document.querySelector(".add-item-input");
const addBtn = document.querySelector(".btn-add");

function addNewItem() {
    const name = inputField.value.trim();
    if (name === "") return;
    
    state.push({
        id: Date.now(), 
        name: name,
        count: 1, 
        isBought: false
    });
    
    inputField.value = '';
    inputField.focus();
    saveAndRender();
}

addBtn.addEventListener('click', addNewItem);
inputField.addEventListener('keydown', e => {
    if (e.key === 'Enter') addNewItem();
});

document.querySelector('.column-left').addEventListener('click', function(e) {
    const row = e.target.closest('.list-row');
    if (!row || !row.dataset.id) return; 
    
    const id = Number(row.dataset.id);
    const item = state.find(i => i.id === id);

    if (e.target.closest('[data-action="delete"]')) {
        state = state.filter(i => i.id !== id);
        saveAndRender();
    } 
    else if (e.target.closest('[data-action="toggle"]')) {
        item.isBought = !item.isBought;
        saveAndRender();
    } 
    else if (e.target.closest('[data-action="plus"]')) {
        item.count++;
        saveAndRender();
    } 
    else if (e.target.closest('[data-action="minus"]')) {
        if (item.count > 1) {
            item.count--;
            saveAndRender();
        }
    } 
    else if (e.target.closest('[data-action="edit"]')) {
        const nameDiv = e.target.closest('.item-name');
        
        nameDiv.innerHTML = `<input type="text" class="edit-input" value="${item.name}" style="width: 100%; font-size: inherit; padding: 2px;">`;
        const input = nameDiv.querySelector('.edit-input');
        input.focus();
        
        input.addEventListener('blur', function() {
            const newName = input.value.trim();
            if (newName !== "") {
                item.name = newName; 
            }
            saveAndRender();
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') input.blur();
        });
    }
});

saveAndRender();