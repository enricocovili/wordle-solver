function setup_autowrite() { // change input focus when a letter is entered
    var elts = document.getElementsByClassName('letter-input')
    Array.from(elts).forEach(function (elt) {
        elt.addEventListener("keyup", function (event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13 || elt.value.length == 1) {
                var nextDiv = elt.parentElement.nextElementSibling;
            }
            else if (event.keyCode === 8 && elt.value.length == 0) {
                var nextDiv = elt.parentElement.previousElementSibling;
            }
            if (nextDiv != null) {
                var nextInput = nextDiv.firstElementChild;
                nextInput.focus();
            }
        });
    })
}

function createLengthButtons(minLen, maxLen) {
    var lengthBtns = document.getElementById("length-buttons");
    lengthBtns.innerHTML = "";
    for (var i = minLen; i <= maxLen; i++) {
        var btn = document.createElement("button");
        btn.setAttribute("class", "length-btn");
        btn.setAttribute("id", "btn-" + i);
        btn.setAttribute("onclick", "setWordLength(" + i + ")");
        btn.innerHTML = i;
        lengthBtns.appendChild(btn);
    }
}


function createLetterInput(length) {
    var solverRow = document.getElementById("solver-row");
    solverRow.innerHTML = "";
    for (var i = 0; i < length; i++) {
        var div = document.createElement("div");
        div.setAttribute("class", "letter-container");

        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "correct-position");
        input.classList.add("letter-input");
        input.setAttribute("id", "correct-input-" + i);
        input.setAttribute("maxlength", "1");

        var change_mode_btn = document.createElement("button");
        change_mode_btn.setAttribute("class", "change-mode-btn");
        change_mode_btn.classList.add("correct-position");
        change_mode_btn.setAttribute("id", "change-mode-btn-" + i);
        change_mode_btn.setAttribute("onclick", "changeMode(" + i + ")");
        change_mode_btn.innerHTML = "✓";

        div.appendChild(input);
        div.appendChild(change_mode_btn);

        solverRow.appendChild(div);
    }
}

function setWordLength(length) {
    // set the active button
    var buttons = document.getElementsByClassName("length-btn");
    for (var i = 0; i < buttons.length; i++) {
        if (i + 4 == length)
            buttons[i].classList.add("active");
        else
            buttons[i].classList.remove("active");
    }
    var activeBtn = document.getElementById("btn-" + length);
    activeBtn.classList.add("active");
    createLetterInput(length);
    setup_autowrite();
}

function changeMode(index) {
    var btn = document.getElementById("change-mode-btn-" + index);
    var input = document.getElementById("correct-input-" + index);
    if (btn.innerHTML == "✓") {
        btn.innerHTML = "X";
        btn.classList.remove("correct-position");
        btn.classList.add("wrong-position");
        input.classList.remove("correct-position");
        input.classList.add("wrong-position");
    }
    else {
        btn.innerHTML = "✓";
        btn.classList.remove("wrong-position");
        btn.classList.add("correct-position");
        input.classList.remove("wrong-position");
        input.classList.add("correct-position");
    }
}

function retrieveLetters() {
    var solverRow = document.getElementById("solver-row");
    word_length = solverRow.children.length;
    goodLetters = "";
    outOfPlaceLetters = "";
    for (var i = 0; i < word_length; i++) {
        var input = document.getElementById("correct-input-" + i);
        if (input.value == "")
            continue;
        if (input.classList.contains("correct-position"))
            goodLetters += (input.value.toLowerCase() + (i + 1) + ",");
        else
            outOfPlaceLetters += (input.value.toLowerCase() + (i + 1) + ",");
    }
    goodLetters = goodLetters.substring(0, goodLetters.length - 1); // remove last comma
    outOfPlaceLetters = outOfPlaceLetters.substring(0, outOfPlaceLetters.length - 1); // remove last comma
    badLetters = document.getElementById("bad-letters").value.toLowerCase();
    // insert commas between letters
    badLetters = badLetters.split("").join(",");
}

function submit() {
    retrieveLetters();
    var url = "https://liuk3.ddns.net/wordle-solver/api/v1/words?" +
        "length=" + word_length +
        "&good_letters=" + goodLetters +
        "&bad_letters=" + badLetters +
        "&out_of_place_letters=" + outOfPlaceLetters;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function () {
        var data = JSON.parse(this.response);
        var wordList = document.getElementById("results");
        wordList.innerHTML = "<ul></ul>";
        ul = wordList.firstElementChild;
        ul.setAttribute("id", "results");
        data["words"].forEach(word => {
            var li = document.createElement("li");
            li.setAttribute("class", "result");
            li.innerHTML = word;
            wordList.firstElementChild.appendChild(li);
        });
    }
    request.send();
}
