import {handleDeleteButtonClick} from "./deleteHandler.js";
import {handleDoneButtonClick} from "./doneHandler.js";


document.addEventListener('DOMContentLoaded', () => {
    let previouslyFocused = document.activeElement;
    document.body.classList.add('flex-grow')
    window.addEventListener('load' ,()=>{
        document.body.classList.add('loaded');
    })
    document.querySelectorAll(".task-card button").forEach(btn => {
        if (btn.classList.contains('done-button')) {
            btn.addEventListener('click', async () => handleDoneButtonClick(btn));
        }
    });

    document.querySelectorAll(".task-card .delete-button").forEach(btn => {
        btn.addEventListener("click", () => handleDeleteButtonClick(btn));
    });

    document.querySelectorAll(".task-card").forEach(card => {
        card.classList.add("task-card-appear");
    });
});
