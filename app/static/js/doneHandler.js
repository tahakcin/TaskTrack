import {showToast} from "./toastDOM.js";

export async function handleDoneButtonClick(doneButton) {
    console.log("done handler tetiklendi")
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
        setTimeout(()=>{
            showToast("Task completed!")
        },300)
    } else {
        console.error("Task could not be updated", result)
    }
}