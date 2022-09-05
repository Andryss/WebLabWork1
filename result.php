<?php
/**
 * Simple php script checking if a point is in the area
 *
 * TYPE:
 *      GET
 * PARAMS:
 *      xValue - X coordinate,
 *      yValue - Y coordinate,
 *      rValue - R radius
 * OUTPUT:
 *      html page with last response status and last 10 success responses
 *
 * Each response consist of:
 *      status - status of the request,
 *      time - current time,
 *      executionTime - execution time,
 *      xValue, yValue, rValue - given params,
 *      result - the computation result
 */

date_default_timezone_set('Europe/Moscow');

// start execution timer
$msStart = microtime(true) * 1000;

// get history from cookie
if (isset($_COOKIE["history"])) {
    $history = json_decode($_COOKIE["history"]);
} else {
    $history = [null,null,null,null,null,null,null,null,null,null];
}

// set up empty response
$status = "undefined";
$response = [
    "time" => date('d.m.o H:i:s eP'),
    "executionTime" => null,
    "xValue" => $_GET["xValue"],
    "yValue" => $_GET["yValue"],
    "rValue" => $_GET["rValue"],
    "result" => null
];

// validate params and compute result
if (isset($_GET["xValue"]) && is_numeric($_GET["xValue"]) &&
    isset($_GET["yValue"]) && is_numeric($_GET["yValue"]) &&
    isset($_GET["rValue"]) && is_numeric($_GET["rValue"])) {

    $x = $_GET["xValue"]; $y = $_GET["yValue"]; $r = $_GET["rValue"];

    if ($x < -3 || $x > 5 || $y < -3 || $y > 3 || $r < 0) {
        $status = "wrong request values";
    } else {
        $status = "ok";

        $result = ($x <= 0 && $y >= 0) && ($x >= -$r && $y <= $r) ||
            ($x >= 0 && $y >= 0) && ($y <= -2 * $x + $r) ||
            ($x >= 0 && $y <= 0) && ($x ** 2 + $y ** 2 <= $r / 2);

        $response["result"] = $result ? "In the area" : "Not in the area";

        // finish execution timer and fill executing time
        $msFinish = microtime(true) * 1000;
        $response["executionTime"] = ($msFinish - $msStart) . "ms";

        // add ok-response to history
        for ($i = 9; $i > 0; $i--) {
            $history[$i] = $history[$i - 1];
        }
        $history[0] = $response;
    }
} else {
    $status = "wrong request format";
}

// form response html page
$dom = new DOMDocument();
$dom->loadHTMLFile("answer.html");
$header = $dom->getElementById("lastResponseStatus");
$header->append($status);
$table = $dom->getElementById("responseTable");

// fill response html
foreach ($history as $index => $tmpResponse) {
    if ($tmpResponse != null) {
        $tr = $dom->createElement("tr");
        $tr->appendChild($dom->createElement("td", $index + 1));
        foreach ($tmpResponse as $item) {
            $tr->appendChild($dom->createElement("td", $item));
        }
        $table->appendChild($tr);
    }
}

// update cookie
setcookie("history", json_encode($history), time() + 60);

echo $dom->saveHTML();
