'use strict';

let habits = [
    [
        {
            id: 1,
            icon: "sport",
            name: "kliky",
            target: 10,
            image: "dumbbell.svg",
            days: [
                { comment: "Nějaký popis" },
                { comment: "Něco navíc" }
            ]
        },
        {
            id: 2,
            icon: "water",
            name: "volný čas",
            target: 10,
            image: "water.svg",
            days: [
                { comment: "Výborně" }
            ]
        },
        {
            id: 3,
            icon: "food",
            name: "zdravá výživa",
            target: 10,
            image: "food.svg",
            days: [
                { comment: "Výborně" }
            ]
        },
        {
            id: 4,
            icon: "add",
            name: "přidat koniček",
            target: 10,
            image: "add.svg",
            days: [
                { comment: "Výborně" }
            ]
        }
    ]
];

const HABIT_KEY = 'HABIT_KEY';

/* Page */

const page = {
    menu: document.querySelector('.aside-menu'),
    content: {
        h2: document.querySelector('.content h2'),
        progressPercent: document.querySelector('.progress-percent'),
        progressCover: document.querySelector('.progress-bar-wrapper'),
        records: {
            recordsContainer: document.querySelector('.active-records'),
            recordDay: document.querySelector('.record-day')
        }
    },
    popup: {
        popupCover: document.querySelector('.popup-wrapper'),
        inputIcon: document.querySelector('.popup-form input[name="icon"]')
    }
}

/* Local Storage */

function loadData() {
    const dataFromStorage = localStorage.getItem(HABIT_KEY);
    const habitArr = JSON.parse(dataFromStorage);
    if (Array.isArray(habitArr)) {
        habits = habitArr;
    }
}

function saveData() {
    localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}

/* Menu rendering */

function menuRender(activeMenuItem) {

    page.menu.innerHTML = ''; // Clearing menu content before rendering

    for (let index = 0; index < habits[0].length; index++) {
        let habit = habits[0][index];
        let isExists = document.querySelector(`[menu-item-id="${habit.id}"]`);

        let element;

        if (!isExists) {
            element = document.createElement('button');
            element.setAttribute('menu-item-id', habit.id);
            element.classList.add('aside-menu-item');

            element.addEventListener('click', () => rerender(habit));

            page.menu.appendChild(element);
        }
        else {
            element = isExists;
            element.classList.remove('active');
        }

        let lastIndex = habits[0].length - 1;

        if (index === lastIndex) {
            element.classList.add('add');
            element.setAttribute('onclick', 'popupToggle()');
        }

        if (activeMenuItem.id === habit.id) {
            element.classList.add('active');
            element.style.backgroundImage = `url("assets/images/svg/${habit.image.replace('.svg', '-hover.svg')}")`;

        } else {
            element.style.backgroundImage = `url("assets/images/svg/${habit.image}")`;

            if (activeMenuItem.id !== habit.id) {
                element.addEventListener('mouseenter', function () {
                    if (!element.classList.contains('active')) {
                        element.style.backgroundImage = `url("assets/images/svg/${habit.image.replace('.svg', '-hover.svg')}")`;
                    }
                });

                element.addEventListener('mouseleave', function () {
                    if (!element.classList.contains('active')) {
                        element.style.backgroundImage = `url("assets/images/svg/${habit.image}")`;
                    }
                });
            }
        }
    }
}

/* Content rendering */

function contentRender(activeMenuItem) {

    page.content.h2.innerText = activeMenuItem.name;

    const progress = activeMenuItem.days.length / activeMenuItem.target > 1
        ? 100
        : activeMenuItem.days.length / activeMenuItem.target * 100;

    page.content.progressPercent.innerText = progress.toFixed(0) + '%';

    page.content.progressCover.setAttribute('style', `width: ${progress}%`);

    page.content.records.recordsContainer.innerHTML = '';

    for (let index in activeMenuItem.days) {
        let element = document.createElement('div');
        element.classList.add('record');
        element.innerHTML = `<span class="record-day">Den ${Number(index) + 1}.</span>
        <span class="record-text">${activeMenuItem.days[index].comment}</span>
        <button class="record-remove" onclick="removeRecord(${index})"></button>`;
        page.content.records.recordsContainer.appendChild(element);
    }

    // Show or hide the record form when target is reached

    const addNewRecord = document.querySelector('.content > .record');

    if (addNewRecord) {
        addNewRecord.style.display = activeMenuItem.days.length >= activeMenuItem.target ? 'none' : 'flex';
    }

    page.content.records.recordDay.innerHTML = `Den ${activeMenuItem.days.length + 1}.`
}

/* Add record comment */

function addRecord(event) {
    event.preventDefault();

    const commentInput = document.querySelector('.input-icon');
    const comment = commentInput.value.trim();
    const activeMenuItem = document.querySelector('.aside-menu-item.active');

    if (activeMenuItem) {
        const activeMenuItemId = activeMenuItem.getAttribute('menu-item-id');
        const activeMenuItemData = habits.flat().find(item => item.id === parseInt(activeMenuItemId));

        if (activeMenuItemData.days.length < activeMenuItemData.target && comment !== '') {
            const newRecord = { comment: comment };
            activeMenuItemData.days.push(newRecord);
        }

        rerender(activeMenuItemData);
        saveData();
    }

    commentInput.value = '';
}

/* Remove record comment */

function removeRecord(index) {
    const activeMenuItem = document.querySelector('.aside-menu-item.active');

    if (activeMenuItem) {
        const activeMenuItemId = activeMenuItem.getAttribute('menu-item-id');
        const activeMenuItemData = habits.flat().find(item => item.id === parseInt(activeMenuItemId));

        if (index >= 0 && index < activeMenuItemData.days.length) {
            activeMenuItemData.days.splice(index, 1);
        }

        rerender(activeMenuItemData);
        saveData();
    }
}

/* Popup */

function popupToggle() {
    const popupForm = document.querySelector('.popup-form');
    popupForm.reset();

    if (page.popup.popupCover.classList.contains('popup-hidden')) {
        page.popup.popupCover.classList.remove('popup-hidden');
    } else {
        page.popup.popupCover.classList.add('popup-hidden');
    }
}

function setIcon(context, icon) {
    page.popup.inputIcon.value = icon;

    const iconsAll = document.querySelectorAll('.icon');

    iconsAll.forEach(iconElement => {
        iconElement.classList.remove('icon-active');
    });

    context.classList.add('icon-active'); // Adding .icon-active for selected icon only
}

function addMenuItem(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = form.querySelector('input[name="name"]');
    const iconInput = form.querySelector('input[name="icon"]');
    const targetInput = form.querySelector('input[name="target"]');

    const name = nameInput.value.trim();
    const icon = iconInput.value.trim();
    const target = parseInt(targetInput.value);

    const activeIcon = document.querySelector('.icon.icon-active');
    if (!activeIcon) {
        alert('Please choose habit category to continue.');
        return;
    } // Checking if the icon is selected

    if (name && icon && !isNaN(target) && target > 0) {
        const newMenuItem = {
            id: habits[0].length + 1,
            icon: icon,
            name: name,
            target: target,
            image: `${icon}.svg`,
            days: []
        };

        habits[0].splice(habits[0].length - 1, 0, newMenuItem);//Insert new element before the last menu item

        popupToggle();
        saveData();
        rerender(newMenuItem);
    }
}

/* Page rerender */

function rerender(accessByObjectOrId) {
    const activeMenuItem = typeof accessByObjectOrId === 'number'
        ? habits[0].find(activeMenuItem => activeMenuItem.id === accessByObjectOrId)
        : accessByObjectOrId;

    if (!activeMenuItem) return;

    menuRender(activeMenuItem);
    contentRender(activeMenuItem);
}

// init
(() => {
    loadData();
    rerender(habits[0][0].id);
    saveData();
})();
