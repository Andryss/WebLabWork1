const cookieImage = $("#cookieImage");
const xTextField = $("#xTextField");
const yTextField = $("#yTextField");
const rTextField = $("#rTextField");
const submitForm = $("#submitForm");
const historyTable = $("#historyTable");
const historyTableContent = $("#historyTableContent");


cookieImage.on("click", function (event) {
    if (Math.random() > 0.2) {
        alert("This site uses cookies, but you are not asked ._.");
    } else {
        alert("Don't crumble your cookies here!");
    }
})

const simpleNumberPattern = /^-?\d+(\.\d+)?$/
const numberPattern = /^((-?[1-9]\d*(\.\d+)?)|([0](\.\d+)?)|(-[0]\.\d+))$/

const eventsToValidate = ["keyup", "keydown"]
eventsToValidate.forEach(function (event) {
    xTextField.on(event, function (event) { validateXField() })
    yTextField.on(event, function (event) { validateYField() })
    rTextField.on(event, function (event) { validateRField() })
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
            "rValue": rTextField.val()
        }
    }).done(function (res) {
        handleResponse(res);
    }).fail(function (msg, exception) {
        alert("Something wrong: " + msg.status + " " + exception);
    }).always(function () {
        clearForm();
    });

    // let xhr;
    // if (window.XMLHttpRequest) { xhr=new XMLHttpRequest(); }
    // else { xhr=new ActiveXObject("Microsoft.XMLHTTP"); }
    //
    // xhr.open("GET", "result.php?xValue=" + xTextField.val() + "&yValue=" + yTextField.val() + "&rValue=" + rTextField.val(), true);
    // xhr.onreadystatechange(function () {
    //     alert(xhr.responseText);
    //     if (xhr.readyState === 4 && xhr.status === 200) handleResponse(xhr.responseText);
    //     clearForm();
    // })
    // xhr.send();
}

function handleResponse(response) {
    // TODO: make json handling more fluent

    const htmlTable = document.createElement("table");
    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        if (element != null) {
            const htmlRow = document.createElement("tr");

            const numCol = document.createElement("td");
            numCol.append("" + (i + 1));
            htmlRow.appendChild(numCol);

            const timeCol = document.createElement("td");
            timeCol.append(element["time"]);
            htmlRow.appendChild(timeCol);

            const execCol = document.createElement("td");
            execCol.append(element["executionTime"]);
            htmlRow.appendChild(execCol);

            const xCol = document.createElement("td");
            xCol.append(element["xValue"]);
            htmlRow.appendChild(xCol);

            const yCol = document.createElement("td");
            yCol.append(element["yValue"]);
            htmlRow.appendChild(yCol);

            const rCol = document.createElement("td");
            rCol.append(element["rValue"]);
            htmlRow.appendChild(rCol);

            const resultCol = document.createElement("td");
            resultCol.append(element["result"]);
            htmlRow.appendChild(resultCol);


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

// const submitButton = document.getElementById("submitButton");
// const submitButtonParent = submitButton.parentElement;
// submitButton.addEventListener('mouseenter', function (event) {
//     let submitButtonBound;
//     do {
//         submitButton.style.left = (Math.random() * (submitButtonParent.clientWidth - submitButton.clientWidth)) + "px";
//         submitButton.style.top = (Math.random() * (submitButtonParent.clientHeight - submitButton.clientHeight)) + "px";
//         submitButtonBound = submitButton.getBoundingClientRect();
//     } while (event.x >= submitButtonBound.x && event.x <= submitButtonBound.x + submitButtonBound.width &&
//         event.y >= submitButtonBound.y && event.y <= submitButtonBound.y + submitButtonBound.height)
// })

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

submitForm.on("submit", function (event) {
    event.preventDefault();
    validateForm();
})