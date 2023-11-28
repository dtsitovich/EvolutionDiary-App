'use strict';

let habits = [];
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

    for (let index = 0; index < habits.length; index++) {
        let habit = habits[index];
        let isExists = document.querySelector(`[menu-item-id="${habit.id}"]`);

        let element;

        if (!isExists) {
            element = document.createElement('button');
            element.setAttribute('menu-item-id', habit.id);
            element.classList.add('aside-menu-item');

            element.addEventListener('click', () => rerender(habit.id));

            page.menu.appendChild(element);
        } else {
            element = isExists;
            element.classList.remove('active');
        }

        let lastIndex = habits.length - 1;

        if (index === lastIndex) {
            element.classList.add('add');
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

function rerender(activeMenuItemId) {
    let activeMenuItem = habits.find(habit => habit.id === activeMenuItemId);
    menuRender(activeMenuItem);
}

// init
(() => {
    loadData();
    rerender(habits[0].id);
})();
