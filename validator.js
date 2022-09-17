"use strict";

const cookieImage = $("#cookieImage");
const xTextField = $("#xTextField");
const yTextField = $("#yTextField");
const rTextField = $("#rTextField");
const submitForm = $("#submitForm");
const historyTableContent = $("#historyTableContent");


cookieImage.on("click", function () {
    if (Math.random() > 0.2) {
        alert("This site uses cookies, but you are not asked :>");
    } else {
        alert("Don't crumble your cookies here!");
    }
})

const numberPattern = /^((-?[1-9]\d*(\.\d+)?)|(0(\.\d+)?)|(-0\.\d+))$/

const eventsToValidate = ["keyup", "keydown"]
eventsToValidate.forEach(function (event) {
    xTextField.on(event, function () { validateXField() })
    yTextField.on(event, function () { validateYField() })
    rTextField.on(event, function () { validateRField() })
})

submitForm.on("submit", function (event) {
    event.preventDefault();
    validateForm();
})

function validateXField() {
    return validateNumberTextField(xTextField, -3, 5);
}

function validateYField() {
    return validateNumberTextField(yTextField, -3, 3);
}

function validateRField() {
    return validateNumberTextField(rTextField, 0);
}

function validateNumberTextField(textField, low = null, high = null) {
    if (isBlank(textField)) return false;
    if (isNotNumber(textField)) return false;
    if (isNotInRange(textField,low,high)) return false;
    makeValid(textField); return true;
}

function isBlank(textField) {
    if (textField.val() === "") {
        makeInvalid(textField);
        textField.addClass("blank");
        return true;
    } else {
        textField.removeClass("blank");
        return false;
    }
}

function isNotNumber(textField) {
    if (!numberPattern.test(textField.val())) {
        makeInvalid(textField);
        textField.addClass("not-a-number");
        return true;
    } else {
        textField.removeClass("not-a-number");
        return false;
    }
}

function isNotInRange(textField, low = null, high = null) {
    console.assert(low != null || high != null);
    if (low != null && high != null) console.assert(low <= high);
    const value = parseFloat(textField.val());
    console.assert(!isNaN(value));
    if (low && value < low || high && value > high) {
        makeInvalid(textField);
        textField.addClass("out-of-range");return true;
    } else {
        textField.removeClass("out-of-range");
        return false;
    }
}

function makeInvalid(textField) {
    textField.removeClass("valid");
    textField.addClass("invalid");
}

function makeValid(textField) {
    textField.removeClass("invalid")
    textField.addClass("valid");
}


function validateForm() {
    if (validateFields()) {
        sendFormToServer();
    }
}

function validateFields() {
    return validateXField() & validateYField() & validateRField();
}

function sendFormToServer() {
    $.ajax({
        type: "GET",
        url: "result.php",
        dataType: "json",
        data: {
            "xValue": xTextField.val(),
            "yValue": yTextField.val(),
            "rValue": rTextField.val(),
            "timezoneOffset": -(new Date().getTimezoneOffset())
        }
    }).done(function (res) {
        handleResponse(res);
    }).fail(function (msg, exception) {
        alert("Something wrong: " + msg.status + " " + exception);
    }).always(function () {
        clearForm();
    });
}

function handleResponse(response) {
    const htmlTable = document.createElement("table");
    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        if (element != null) {
            const htmlRow = document.createElement("tr");
            const numCol = document.createElement("td");
            numCol.append("" + (i + 1));
            htmlRow.appendChild(numCol);
            [
                "time",
                "executionTime",
                "xValue",
                "yValue",
                "rValue",
                "result"
            ].forEach((prop) => {
                const col = document.createElement("td");
                col.append(element[prop]);
                htmlRow.appendChild(col);
            })
            htmlTable.appendChild(htmlRow);
        }
    }
    historyTableContent.html(htmlTable.innerHTML);
}

function clearForm() {
    xTextField.val("");
    yTextField.val("");
    rTextField.val("");

    xTextField.removeClass("valid");
    yTextField.removeClass("valid");
    rTextField.removeClass("valid");
}

drawPlotOnCanvas();

function drawPlotOnCanvas() {
    const canvas = document.getElementById("plotCanvas");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        //ctx.strokeRect(0,0,300,300);

        ctx.fillStyle = "lightblue";
        // area
        ctx.beginPath();
        ctx.moveTo(150 + 60, 150);
        ctx.arc(150, 150, 60, 0, 0.5 * Math.PI);
        ctx.lineTo(150, 150);
        ctx.lineTo(150 - 120, 150);
        ctx.lineTo(150 - 120, 150 - 120);
        ctx.lineTo(150 + 2, 150 - 120);
        ctx.fill();

        ctx.fillStyle = "black";
        // OX
        ctx.fillRect(5, 150 - 1, 290, 3);
        ctx.beginPath();
        ctx.moveTo(300, 150);
        ctx.lineTo(300 - 15, 150 + 5);
        ctx.lineTo(300 - 15, 150 - 5 + 1);
        ctx.fill();

        // OY
        ctx.fillRect(150 - 1, 5, 3, 290);
        ctx.beginPath();
        ctx.moveTo(150, 0);
        ctx.lineTo(150 + 5, 15);
        ctx.lineTo(150 - 5 + 1, 15);
        ctx.fill();

        // lines
        ctx.fillRect(150 - 3, 150 + 120 - 1, 7, 3);
        ctx.fillRect(150 - 3, 150 + 60 - 1, 7, 3);
        ctx.fillRect(150 - 3, 150 - 60 - 1, 7, 3);
        ctx.fillRect(150 - 3, 150 - 120 - 1, 7, 3);
        ctx.fillRect(150 + 120 - 1, 150 - 3, 3, 7);
        ctx.fillRect(150 + 60 - 1, 150 - 3, 3, 7);
        ctx.fillRect(150 - 60 - 1, 150 - 3, 3, 7);
        ctx.fillRect(150 - 120 - 1, 150 - 3, 3, 7);

        // text
        ctx.font = "14pt Comic Sans MS";
        ctx.fillText("-R", 150 - 140 + 7, 150 - 7);
        ctx.fillText("-R/2", 150 - 85 + 7, 150 - 7);
        ctx.fillText("R/2", 150 + 40 + 7, 150 - 7);
        ctx.fillText("R", 150 + 120 - 7, 150 - 7);

        ctx.fillText("-R", 150 + 7, 150 + 120 + 7);
        ctx.fillText("-R/2", 150 + 7, 150 + 60 + 7);
        ctx.fillText("R/2", 150 + 7, 150 - 60 + 7);
        ctx.fillText("R", 150 + 7, 150 - 120 + 7);

        ctx.fillText("X", 150 + 140 - 7, 150 + 30 - 7);
        ctx.fillText("Y", 150 - 15 - 7, 150 - 140 + 7);
    }
}