export function showToast(message, type = "success") {
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