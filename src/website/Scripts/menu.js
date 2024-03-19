const menuIcon = document.querySelector("#menu-icon")
const navbar = document.querySelector(".navbar")

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active')
})