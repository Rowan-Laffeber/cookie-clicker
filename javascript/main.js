document.getElementById("cookie").onclick = function() {Counter()};

let count = 0;

function Counter() {
    count++;
    document.getElementById('counter').textContent = count;
}