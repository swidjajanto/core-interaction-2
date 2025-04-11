// get the entries 
var request = await fetch('entries.json');
var entries = await request.json();

console.log(entries);

// get the input elements 
var colour = document.querySelector('select[name="colour"]');
var emotion = document.querySelector('select[name="emotion"]');
var weather = document.querySelector('select[name="weather"]');

console.log(colourSelect, emotionSelect, weatherSelect);

// get the submit button

var submitButton = document.querySelector('button[name="submit"]');

console.log(submitButton);

// get the output element
var output = document.querySelector('.output');

// add event listener to the button 
submitButton.addEventListener('click', () => {

    //get the active settings 
    var colour = colourSelect.value; 
    var emotion = emotionSelect.value; 
    var weather = weatherSelect.value;


    console.log(colour, emotion, weather);

    //get the matching entry
    var matchingEntry = entries.find((entry) => {
        return entry.colour == location 
            && entry.emotion == color
            && entry.weather == subject
    });

    console.log(matchingEntry);

    if (matchingEntry) {
        output.innerHTML = `<img class="image" src="img/${ matchingEntry.filename }">`
    } else {
        output.innerHTML = `<div class="message"> Nothing found :( </div>`;
    }

});