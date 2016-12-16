$(function () {
    //The time it takes to flash a single color, including pause time:
    const FULL_ANIM_DELAY = 900;
    //Seperate const for half of the animation time, not counting pause time:
    const HALF_ANIM_DELAY = 400;
    //Number of correct clicks required to win a game:
    const WIN_LENGTH = 20;
    const Hex = {
        GREEN: "#03A624",
        LGREEN: "#84BF90",
        RED: "#F50E0E",
        LRED: "#F26161",
        BLUE: "#0033ff",
        LBLUE: "#5174ff",
        YELLOW: "#CFEA00",
        LYELLOW: "#e2ea5d"
    };
    const Index = {
        GREEN: 0,
        RED: 1,
        BLUE: 2,
        YELLOW: 3
    };
    const Sounds = {
        GREEN: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        RED: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        BLUE: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        YELLOW: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    };
    let colorSeq = [];
    let clicks = 0;
    let canClick = false;
    let isStrict = false;
    function flashColor(delay, color, selector) {
        window.setTimeout(() => {
            $(selector).css("background-color", Hex["L" + color]);
            Sounds[color].play();
        }, delay);
        window.setTimeout(() => {
            $(selector).css("background-color", Hex[color]);
        }, delay + HALF_ANIM_DELAY);
    }
    function playSeq() {
        canClick = false;
        for (let i = 0; i < colorSeq.length; i++) {
            let tempColor = "GREEN";
            let tempSelector = "#green";
            if (colorSeq[i] === Index.RED) {
                tempColor = "RED";
                tempSelector = "#red";
            }
            else if (colorSeq[i] === Index.BLUE) {
                tempColor = "BLUE";
                tempSelector = "#blue";
            }
            else if (colorSeq[i] === Index.YELLOW) {
                tempColor = "YELLOW";
                tempSelector = "#yellow";
            }
            flashColor(i * FULL_ANIM_DELAY, tempColor, tempSelector);
        }
        window.setTimeout(() => {
            canClick = true;
        }, FULL_ANIM_DELAY * colorSeq.length);
    }
    function addToSeq() {
        colorSeq.push(Math.floor(Math.random() * 4));
        if (colorSeq.length > WIN_LENGTH) {
            endGame("You win!");
        }
        else {
            playSeq();
            $(".game-msg").text(colorSeq.length + " steps.");
        }
    }
    $("#start-btn").click(function () {
        colorSeq = [];
        clicks = 0;
        $(".game-msg").text("");
        addToSeq();
        isStrict = $("#strictcheck").prop("checked");
        $(".btn-row").hide();
    });
    function endGame(message) {
        canClick = false;
        $(".game-msg").text(message);
        $(".btn-row").show();
    }
    function onClickCheck(color, selector) {
        if (canClick) {
            if (colorSeq[clicks] === Index[color]) {
                flashColor(0, color, selector);
                if (clicks < colorSeq.length - 1) {
                    $(".game-msg").text("Correct!");
                    clicks++;
                }
                else {
                    canClick = false;
                    clicks = 0;
                    //Without a delay, the click animation will overlap with the new sequence.
                    window.setTimeout(() => {
                        $(".game-msg").text("");
                        addToSeq();
                    }, FULL_ANIM_DELAY);
                }
            }
            else {
                if (isStrict) {
                    endGame("Game over. :( Try again.");
                }
                else {
                    $(".game-msg").text("That's not correct!");
                }
            }
        }
    }
    $("#green").click(function () {
        onClickCheck("GREEN", "#green");
    });
    $("#red").click(function () {
        onClickCheck("RED", "#red");
    });
    $("#blue").click(function () {
        onClickCheck("BLUE", "#blue");
    });
    $("#yellow").click(function () {
        onClickCheck("YELLOW", "#yellow");
    });
});
