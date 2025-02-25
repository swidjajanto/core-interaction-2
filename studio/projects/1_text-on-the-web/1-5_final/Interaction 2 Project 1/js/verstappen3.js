var text7 = new Typewriter(document.getElementById('text7'), { delay: 70 });
var text8 = new Typewriter(document.getElementById('text8'), { delay: 70 });
var text9 = new Typewriter(document.getElementById('text9'), { delay: 40 });
var text10 = new Typewriter(document.getElementById('text10'), { delay: 70 });


text7
    .pauseFor(200)
    .typeString('Lambiase')
    .start();


text8
    .pauseFor(1000) 
    .typeString('Keep working the tyres, mate.')
    .start();

text9
    .pauseFor(5000)
    .typeString('Okay I think all the cars ahead of you are going to pass Hamilton. Everybody behind you will stay in position. Yes, everybody up to Vettel are allowed to overtake Hamilton. Safety Car is in this lap, Max. Mode one and strat one. Mode one, strat one. And B-bal offset when you need it. B-bal offset. This is it mate. This is it. Just think about your tools you need.')
    .start();


text10
    .pauseFor(23500) 
    .typeString('Safety Car turn 14. Remember you’re racing from the line. Safety Car turn 15.')
    .start();

