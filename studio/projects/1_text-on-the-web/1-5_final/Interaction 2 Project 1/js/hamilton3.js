var text11 = new Typewriter(document.getElementById('text11'), { delay: 70 });
var text12 = new Typewriter(document.getElementById('text12'), { delay: 70 });
var text13 = new Typewriter(document.getElementById('text13'), { delay: 70 });
var text14 = new Typewriter(document.getElementById('text14'), { delay: 70 });
var text15 = new Typewriter(document.getElementById('text15'), { delay: 70 });

text11
    .pauseFor(21000)
    .typeString('Hamilton')
    .start();


text12
    .pauseFor(22000) 
    .typeString('This is getting manipulated, man.')
    .start();

text13
    .pauseFor(26000)
    .typeString('Bonnington')
    .start();


text14
    .pauseFor(27500) 
    .typeString('I’m just speechless, absolutely speechless.')
    .start();


text15
    .pauseFor(32000)
    .typeString('Strat mode one. And supposed to be going to the grid, Lewis.')
    .start();
