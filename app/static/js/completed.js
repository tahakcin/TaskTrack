document.addEventListener('DOMContentLoaded', () => {
    let previouslyFocused = document.activeElement;
    document.body.classList.add('flex-grow')
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    document.querySelectorAll(".task-card .delete-button").forEach(btn => {
        btn.addEventListener("click", () => handleDeleteButtonClick(btn));
    });

    document.querySelectorAll(".task-card").forEach(card => {
        card.classList.add("task-card-appear");
    });

    function closeModal() {
        const modal = document.getElementById('deleteModal');
        const content = modal.querySelector('.modal-content');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0', 'transition', 'duration-300',
            "ease-in-out");
        content.addEventListener("transitionend", () => {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
            content.classList.remove("scale-95", "opacity-0", "transition",
                "duration-300", "ease-in-out");
            document.body.classList.remove("overflow-hidden")
            if (previouslyFocused) {
                previouslyFocused.focus();
            }
        }, {once: true});
    }

    function handleDeleteButtonClick(delButton) {
        const card = delButton.closest(".task-card");
        const taskIdToDelete = delButton.closest(".task-card").dataset.id;
        const modal = document.getElementById('deleteModal');
        const yesButton = modal.querySelector('button.yes-button');
        const noButton = modal.querySelector('button#no-cancel-button');

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
                    showToast("Task successfully removed ✅");
                }, 300);

            }
            closeModal();
        }, {once: true});
        noButton.addEventListener('click', () => {
            closeModal();
        })
    }

    function showToast(message, type = "success") {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-5 right-5 flex items-center w-full 
        max-w-xs p-4 mb-4 text-white rounded-lg shadow-lg z-50 
        ${type === "success" ? "bg-green-600" : type === "error"
            ? "bg-red-600" : "bg-gray-700"}`;
        toast.innerHTML = `
         <div class="inline-flex items-center justify-center w-8 h-8 text-white bg-opacity-20 rounded-lg">
            <i class="fas fa-check-circle text-white text-lg"></i>
         </div>
         <div class="ml-3 text-sm font-medium">${message}</div>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("opacity-0", "transition", "duration-300");
            toast.addEventListener("transitionend", () => toast.remove());
        }, 2000)
    }
});