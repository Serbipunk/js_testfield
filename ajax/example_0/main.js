var pageCounter = 1;
var animalContainer = document.getElementById("animal-info");
var btn = document.getElementById("btn");
btn.addEventListener("click", function() {  // anonymous function
    var ourRequest = new XMLHttpRequest();
    // open(method, url, async=true, user, password)
    ourRequest.open("GET", "https://learnwebcode.github.io/json-example/animals-1.json");

    ourRequest.onload = function() {  // the aync call-back function
        // console.log(ourRequest.responseText);
        // var ourData = ourRequest.responseText;
        var ourData = ourRequest.responseText;
        ourData = JSON.parse(ourData);
        // console.log(ourData[0]);
        renderHTML(ourData);
    };
    ourRequest.send();  // send the request
    pageCounter++;
    if(pageCounter > 3) {
        // btn.classList.add("hide-me");
        btn.style.display = "none";
    }
});

function renderHTML(data) {
    var htmlString = "";
    for(var i = 0; i < data.length; i++) {
        htmlString += "<p>" + data[i].name + " is a " + data[i].species + ".</p>";
    }
    animalContainer.insertAdjacentHTML("beforeend", htmlString); 
}