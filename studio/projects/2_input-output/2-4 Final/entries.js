// get the entries 
var request = await fetch('entries.json');
var entries = await request.json();

console.log(entries);

// get the input elements 
var colourSelect = document.querySelector('select[name="colour"]');
var emotionSelect = document.querySelector('select[name="emotion"]');
var weatherSelect = document.querySelector('select[name="weather"]');

console.log(colourSelect, emotionSelect, weatherSelect);

// get the submit button
var submitButton = document.querySelector('button[name="submit"]');

console.log(submitButton);

// get the output element
var output = document.querySelector('.output');

// add event listener to the button 
submitButton.addEventListener('click', () => {

    // get the active settings 
    var colour = colourSelect.value; 
    var emotion = emotionSelect.value; 
    var weather = weatherSelect.value;

    console.log(colour, emotion, weather);

    // get the matching entry
    var matchingEntry = entries.find((entry) => {
        return entry.colour === colour 
            && entry.emotion === emotion
            && entry.weather === weather;
    });

    console.log(matchingEntry);

    if (matchingEntry) {
        window.location = `html/${ matchingEntry.html }`;
    }

});
