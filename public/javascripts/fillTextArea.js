function fillTextArea() {
    var textArea = document.getElementById("description");
    var textAreaValue = document.getElementById("valueForTextField").innerHTML;
    //console.log(textAreaValue);
    textArea.value = textAreaValue;
}   

fillTextArea();