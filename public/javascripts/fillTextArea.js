const escapedString = 'single escaped quote next &#x27;';

function unescapeHTML(escapedHTML) {
    var d = document.createElement('div');
    d.innerHTML = escapedHTML;
    return d.textContent;
}

console.log("escaped: " + escapedString); // This is an escaped string &#x27;
const unescapedString = unescapeHTML(escapedString);
console.log("unescaped: " + unescapedString); // This is an unescaped string &#x27;



function fillTextArea() {
    var textArea = document.getElementById("description");
    var textAreaValue = document.getElementById("valueForTextField").innerHTML;
    let unescapedString = unescapeHTML(textAreaValue);
    console.log("Un-escaped string for form field: " + unescapedString);
    textArea.innerHTML = unescapedString;
}   

fillTextArea();