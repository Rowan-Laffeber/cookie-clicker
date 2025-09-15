let count = 0;
const cookie = document.getElementById('cookie');
const counter = document.getElementById('counter');

// add onto counter onclick
cookie.onclick = () => {
    count++;
    counter.textContent = count;
};

// bigger ans smaller cookie when clicking
const shrinkCookie = () => {
    cookie.style.transition = 'transform 0.1s';
    cookie.style.transform = 'scale(0.825)';
};
const growCookie = () => {
    cookie.style.transition = 'transform 0.1s';
    cookie.style.transform = 'scale(1)';
};

cookie.addEventListener('mouseup', growCookie);
cookie.addEventListener('mouseleave', growCookie);
cookie.addEventListener('touchend', growCookie);
cookie.addEventListener('touchcancel', growCookie);

cookie.addEventListener('mousedown', shrinkCookie);
cookie.addEventListener('touchstart', shrinkCookie);


class Cookies{
    name;
}
let cookies = new Cookies();
cookies.name = "chipszak";

document.getElementById("cookies-name").innerText = cookies.name;

