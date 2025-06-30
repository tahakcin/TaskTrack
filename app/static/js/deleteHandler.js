import {closeModal} from "./closeModal.js";
import {showToast} from "./toastDOM.js";

export function handleDeleteButtonClick(delButton) {
    const card = delButton.closest(".task-card");
    const taskIdToDelete = delButton.closest(".task-card").dataset.id;
    const modal = document.getElementById('deleteModal');
    const yesButton = modal.querySelector('button.yes-button');
    const noButton = modal.querySelector('button#no-cancel-button');
    const cancelButton = modal.querySelector("button#cancel-button")

    modal.querySelector("button").focus()
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    const content = modal.querySelector(".modal-content");
    requestAnimationFrame(() => {
        content.classList.remove("scale-95", "opacity-0");
        content.classList.add("scale-100", "opacity-100");
    });
    document.body.classList.add("overflow-hidden");

    yesButton.addEventListener('click', async () => {
        const response = await fetch('/delete-task', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({task_id: taskIdToDelete})
        })
        const result = await response.json()
        if (result.status === "success") {
            card.classList.add("opacity-0", "scale-95", "transition",
                "duration-300", "ease-in-out");
            setTimeout(() => {
                card.remove();
                showToast("Task successfully removed");
            }, 300);

        }
        closeModal(document.getElementById('deleteModal'));
    }, {once: true});
    noButton.addEventListener('click', () => {
        closeModal(document.getElementById('deleteModal'));
    });
    cancelButton.addEventListener('click', ()=>{
       closeModal(document.getElementById('deleteModal'))
    });
}