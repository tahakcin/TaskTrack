export function closeModal(modal) {
        if (!modal) {
        console.warn('closeModal: modal undefined!');
        return;
    }
    const content = modal.querySelector('.modal-content');
    if (!content) {
        console.warn('closeModal: .modal-content bulunamadı!');
        return;
    }
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0', 'transition', 'duration-300',
        "ease-in-out");
    content.addEventListener("transitionend", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        content.classList.remove("scale-95", "opacity-0", "transition",
            "duration-300", "ease-in-out");
        document.body.classList.remove("overflow-hidden")
    }, {once: true});
}