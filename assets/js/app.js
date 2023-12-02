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
    if (!activeMenuItem) return;

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
        }

        if (activeMenuItem.id === habit.id) {
            element.classList.add('active');
            element.style.backgroundImage = `url("assets/images/svg/${habit.image.replace('.svg', '-hover.svg')}")`;

            const firstMenuItem = document.querySelector('[menu-item-id="1"]');
            if (firstMenuItem && !firstMenuItem.classList.contains('active')) {
                firstMenuItem.classList.remove('default');
                firstMenuItem.style.backgroundColor = '';
                firstMenuItem.style.backgroundImage = '';
            }

        } else if (index === 0) {
            element.classList.add('default');
            element.style.backgroundColor = '#6a6afb';
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

function contentRender(activeMenuItem) {
    if (!activeMenuItem) return;

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
        <button class="record-remove"></button>`;
        page.content.records.recordsContainer.appendChild(element);
    }

    page.content.records.recordDay.innerHTML = `Den ${activeMenuItem.days.length + 1}.`
}

function rerender(accessByObjectOrId) {
    const activeMenuItem = typeof accessByObjectOrId === 'number'
        ? habits[0].find(activeMenuItem => activeMenuItem.id === accessByObjectOrId)
        : accessByObjectOrId;

    if (!activeMenuItem) {
        console.error('Invalid value. Access by Object or Id:', accessByObjectOrId);
        return;
    }

    menuRender(activeMenuItem);
    contentRender(activeMenuItem);
}

// init
(() => {
    loadData();
    rerender(habits[0][0].id);
    saveData();
})();
