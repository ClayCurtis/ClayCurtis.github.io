function toggleDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    } else {
        dropdown.classList.add('show');
    }
}

function toggleContent(id) {
    const contents = document.querySelectorAll('.additional-content');
    contents.forEach(content => {
        if (content.id === id) {
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                setTimeout(() => {
                    content.style.display = 'none';
                }, 150);
            } else {
                content.style.display = 'block';
                setTimeout(() => {
                    content.classList.add('show');
                }, 200);
            }
        } else {
            content.classList.remove('show');
            content.style.display = 'none';
        }
    });
}