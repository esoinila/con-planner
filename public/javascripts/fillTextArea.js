function fillTextArea() {
    var textArea = document.getElementById("description");
    var textAreaValue = document.getElementById("answer").innerHTML;
    console.log("Heppa");

    console.log(textAreaValue);
        //textArea.value = "This is a text area";
    //textArea.value = "This is a text area";
    textArea.value = textAreaValue;
}   

fillTextArea();