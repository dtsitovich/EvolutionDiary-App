'use strict';

let habits = [];
const HABIT_KEY = 'HABIT_KEY';

/* Local Storage */

function loadData() {
    const dataFromStorage = localStorage.getItem('HABIT_KEY');
    const habitArr = JSON.parse(dataFromStorage);
    if (Array.isArray(habitArr)) {
        habits = habitArr;
    }
}

function saveData() {
    localStorage.setItem('HABIT_KEY', JSON.stringify(habits));
}

// init
(() => {
    loadData();
})()
