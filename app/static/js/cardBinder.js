import {handleDoneButtonClick} from "./doneHandler.js";
import {handleDeleteButtonClick} from "./deleteHandler.js";


export function bindTaskCardEvents () {
    document.querySelectorAll('.task-card').forEach(card=>{
        const delBtn = card.querySelector('.delete-button');
        const doneBtn = card.querySelector('.done-button');

        if (delBtn && !delBtn.dataset.bound) {
            delBtn.addEventListener('click',()=>handleDeleteButtonClick(delBtn));
            delBtn.dataset.bound = "true";
        }

        if (doneBtn && !doneBtn.dataset.bound) {
            doneBtn.addEventListener('click', ()=>handleDoneButtonClick(doneBtn));
            doneBtn.dataset.bound = 'true';
        }
    });
}