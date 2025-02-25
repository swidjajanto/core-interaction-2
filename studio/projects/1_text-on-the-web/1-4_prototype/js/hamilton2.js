var text1 = new Typewriter(document.getElementById('text1'), { delay: 70 });
var text2 = new Typewriter(document.getElementById('text2'), { delay: 70 });
var text3 = new Typewriter(document.getElementById('text3'), { delay: 70 });
var text4 = new Typewriter(document.getElementById('text4'), { delay: 70 });
var text5 = new Typewriter(document.getElementById('text5'), { delay: 70 });

text1
    .pauseFor(200)
    .typeString('Hamilton')
    .start();


text2
    .pauseFor(1000)
    .typeString('This is getting manipulated, man.')
    .start();

text3
    .pauseFor(5000)
    .typeString('Bonnington')
    .start();


text4
    .pauseFor(6500) 
    .typeString('I’m just speechless, absolutely speechless.')
    .start();


text5
    .pauseFor(9000)
    .typeString('Strat mode one. And supposed to be going to the grid, Lewis.')
    .start();
