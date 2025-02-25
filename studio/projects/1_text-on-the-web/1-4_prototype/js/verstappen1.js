var text1 = new Typewriter(document.getElementById('text1'), { delay: 70 });
var text2 = new Typewriter(document.getElementById('text2'), { delay: 70 });
var text3 = new Typewriter(document.getElementById('text3'), { delay: 40 });
var text4 = new Typewriter(document.getElementById('text4'), { delay: 70 });


text1
    .pauseFor(200)
    .typeString('Lambiase')
    .start();


text2
    .pauseFor(1000) 
    .typeString('Keep working the tyres, mate.')
    .start();

text3
    .pauseFor(5000)
    .typeString('Okay I think all the cars ahead of you are going to pass Hamilton. Everybody behind you will stay in position. Yes, everybody up to Vettel are allowed to overtake Hamilton. Safety Car is in this lap, Max. Mode one and strat one. Mode one, strat one. And B-bal offset when you need it. B-bal offset. This is it mate. This is it. Just think about your tools you need.')
    .start();


text4
    .pauseFor(24500) 
    .typeString('Safety Car turn 14. Remember you’re racing from the line. Safety Car turn 15.')
    .start();

