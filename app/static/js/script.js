document.addEventListener("DOMContentLoaded", () => {
    const taskTitle = document.getElementById("task-title");
    const taskDescription = document.getElementById("task-description");
    const taskPriority = document.getElementById("task-priority");
    const taskDeadline = document.getElementById("task-deadline");
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const cancelButton = document.getElementById('cancel-button');
    const noCancelButton = document.getElementById('no-cancel-button');
    const modal = document.getElementById('deleteModal');
    const yesButton = document.querySelector('.yes-button')
    let previouslyFocused = document.activeElement;
    let taskIdToDelete = null;
    const today = new Date();
    const formatted = getFormattedDate(today);
    const deadlineInput = document.getElementById('task-deadline');

    if (deadlineInput) {
        deadlineInput.min = formatted;
        deadlineInput.value = formatted;
    }


    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });


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


    taskForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(taskForm)
        const response = await fetch("/", {
            method: "POST",
            body: formData
        })
        const data = await response.json();


        const titleInput = taskTitle.value.toUpperCase();
        const descriptionInput = taskDescription.value;
        const priorityInput = taskPriority.value;
        const deadlineInput = new Date(taskDeadline.value).toLocaleDateString("en-US", {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = "flex";
        deleteButton.setAttribute("data-modal-target", "deleteModal");
        deleteButton.setAttribute("data-modal-toggle", "deleteModal");
        deleteButton.type = 'button';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt text-xl text-white transition duration-200 hover:text-red-500 hover:scale-110 cursor-pointer"></i>';


        const prioritySpan = document.createElement("span");
        prioritySpan.className = "text-sm tracking-tight border p-1 rounded-md";

        if (priorityInput === "high") {
            prioritySpan.classList.add("text-red-400", "bg-red-500/30", "border-red-500/50");
            prioritySpan.innerHTML = "🔴 High Priority";
        } else if (priorityInput === "medium") {
            prioritySpan.classList.add("text-yellow-400", "bg-yellow-500/30", "border-yellow-500/50");
            prioritySpan.innerHTML = "🟡 Medium Priority";
        } else {
            prioritySpan.classList.add("text-green-400", "bg-green-500/30", "border-green-500/50");
            prioritySpan.innerHTML = "🟢 Low Priority";
        }

        const taskCard = document.createElement("div");
        taskCard.className = "task-card flex flex-col task-card w-full max-w-md p-6 bg-white border rounded-lg shadow-sm bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-700 text-white mb-5 ml-3 mt-5 hover:scale-105 transition-transform duration-300 ease-in-out";
        taskCard.dataset.id = data.id;


        const upsideDiv = document.createElement("div");
        upsideDiv.className = "flex justify-between mb-2";
        upsideDiv.appendChild(prioritySpan);
        upsideDiv.appendChild(deleteButton);

        const titleElement = document.createElement("h5");
        titleElement.className = "text-center mb-2 text-2xl font-bold tracking-tight break-words";
        titleElement.textContent = titleInput;

        const descriptionElement = document.createElement("p");
        descriptionElement.className = "mb-3 font-normal break-words text-white";
        descriptionElement.textContent = descriptionInput;


        const deadlineTitle = document.createElement("h5");
        deadlineTitle.className = "text-lg text-yellow-300";
        deadlineTitle.textContent = "Deadline"

        const deadlineDate = document.createElement("p");
        deadlineDate.className = "text-purple-200";
        deadlineDate.textContent = deadlineInput;


        const deadLineSpan = document.createElement("span");
        deadLineSpan.className = "border-2 border-indigo-700 bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md";
        deadLineSpan.appendChild(deadlineTitle);
        deadLineSpan.appendChild(deadlineDate);


        const doneButton = document.createElement("button");
        doneButton.className = "done-button relative inline-flex items-center justify-center text-white rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 bg-gradient-to-r from-blue-500 to-blue-700 shadow-md  transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"


        const doneIcon = document.createElement("i");
        doneIcon.className = "fas fa-check-circle";
        doneIcon.style.marginRight = "5px";
        doneButton.appendChild(doneIcon);
        doneButton.appendChild(document.createTextNode("Done!"));


        const doneButtonContainer = document.createElement("div");
        doneButtonContainer.className = "flex justify-end items-center";
        doneButtonContainer.appendChild(doneButton);


        const deadlineContainer = document.createElement("div");
        deadlineContainer.className = "flex";
        deadlineContainer.appendChild(deadLineSpan);


        const undersideContainer = document.createElement("div");
        undersideContainer.className = "flex justify-between";
        undersideContainer.appendChild(deadlineContainer);
        undersideContainer.appendChild(doneButtonContainer);

        taskCard.appendChild(upsideDiv);
        taskCard.appendChild(titleElement);
        taskCard.appendChild(descriptionElement);
        taskCard.appendChild(undersideContainer);

        taskCard.classList.add("task-card");
        setTimeout(() => {
            taskCard.classList.add("task-card-show");
        }, 100);
        taskList.appendChild(taskCard);
        taskForm.reset();
        taskList.scrollTop = taskList.scrollHeight;

        doneButton.addEventListener("click", () => handleDoneButtonClick(doneButton));

        deleteButton.addEventListener("click", () => handleDeleteButtonClick(deleteButton));

        cancelButton.addEventListener('click', closeModal);
        noCancelButton.addEventListener('click', closeModal);

        yesButton.addEventListener('click', async () => {
            const res = await fetch("/delete-task", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({task_id: taskIdToDelete})
            });
            const result = await res.json();
            if (result.status === 'success')
                document.querySelector(`[data-id="${taskIdToDelete}"]`)?.remove();
            closeModal();
        });
    });

    function closeModal() {
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
                    showToast("Task successfully removed");
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

    function getFormattedDate(date) {
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return `${year}-${month}-${day}`;
    }
});










