import {bindTaskCardEvents} from "./cardBinder.js";


document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('flex-grow')
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    bindTaskCardEvents()

    document.querySelectorAll(".task-card").forEach(card => {
        card.classList.add("task-card-appear");
    });
});