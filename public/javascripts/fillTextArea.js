
function unescapeHTML(escapedHTML) {
    var d = document.createElement('div');
    d.innerHTML = escapedHTML;
    return d.textContent;
}

function fillTextArea() {
    var textArea = document.getElementById("description");
    var textAreaValue = document.getElementById("valueForTextField").innerHTML;
    let unescapedString = unescapeHTML(textAreaValue);
    console.log("Un-escaped string for form field: " + unescapedString);
    textArea.innerHTML = unescapedString;
}   

fillTextArea();