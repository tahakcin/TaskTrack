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

    async function handleDoneButtonClick(doneButton) {
        const taskCard = doneButton.closest(".task-card");
        const titleElement = taskCard.querySelector("h5");
        const descriptionElement = taskCard.querySelector("p");
        const deadlineSpan = taskCard.querySelector("span.border-2")

        const response = await fetch("/mark-task-done", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({task_id: taskCard.dataset.id})
        })

        const result = await response.json();
        if (result.status === "success") {
            taskCard.classList.remove("from-gray-900",
                "hover:scale-105",
                "transition-transform",
                "duration-300",
                "ease-in-out",
                "via-indigo-800",
                "to-gray-700");

            taskCard.classList.add("from-green-700",
                "via-emerald-600",
                "to-teal-500",
                "opacity-85",
                "transition-all",
                "duration-500",
                "hover:scale-105",
                "ease-in-out");

            deadlineSpan.classList.remove("border-indigo-700",
                "from-purple-700",
                "to-indigo-600");

            deadlineSpan.classList.add("border-green-600",
                "from-teal-700",
                "via-emerald-600",
                "to-green-500",
                "opacity-80",
                "transition-all",
                "duration-500",
                "ease-in-out");

            titleElement.classList.add("line-through", "transition-all", "duration-700", "text-gray-400", "ease-out")

            doneButton.classList.remove(
                "transition-all",
                "duration-300",
                "ease-in-out",
                "transform",
                "hover:scale-105",
                "hover:shadow-xl",
                "from-blue-500",
                "to-blue-700");

            doneButton.classList.add("from-gray-500",
                "to-gray-700",
                "cursor-not-allowed",
                "opacity-70",
                "transition-all",
                "duration-500",
                "ease-in-out");

            descriptionElement.classList.remove("text-white");
            descriptionElement.classList.add("transition-all", "duration-500", "text-gray-400", "ease-in-out");

            doneButton.textContent = "";
            doneButton.innerHTML = "✅ Completed!"
            doneButton.disabled = true;
        } else {
            console.error("Task could not be updated", result)
        }
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
         <div class="ml-3 text-sm font-medium">${message}</div>
`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("opacity-0", "transition", "duration-300");
            toast.addEventListener("transitionend", () => toast.remove());
        }, 2000)
    }
});
