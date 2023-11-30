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
    menu: document.querySelector('.aside-menu')
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

function rerender(activeMenuItem) {
    menuRender(activeMenuItem);
}

// init
(() => {
    loadData();
    rerender(habits[0][0].id);
})();
