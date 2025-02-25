var text1 = new Typewriter(document.getElementById('text1'), { delay: 70 });
var text2 = new Typewriter(document.getElementById('text2'), { delay: 70 });
var text3 = new Typewriter(document.getElementById('text3'), { delay: 70 });
var text4 = new Typewriter(document.getElementById('text4'), { delay: 70 });
var text5 = new Typewriter(document.getElementById('text5'), { delay: 70 });
var text6 = new Typewriter(document.getElementById('text6'), { delay: 30 });

text1
    .pauseFor(200)
    .typeString('Bonnington')
    .start();


text2
    .pauseFor(1000) 
    .typeString('So he’s now going to let the cars through.')
    .start();

text3
    .pauseFor(5000)
    .typeString('Hamilton')
    .start();


text4
    .pauseFor(6500) 
    .typeString('[Unclear] going to pass the Safety Car, man.')
    .start();


text5
    .pauseFor(9000)
    .typeString('Bonnington')
    .start();


text6
    .pauseFor(12000) 
    .typeString('So he’s going to let four cars through. And Safety Car in this lap, Safety Car in this lap. So just prepare your tyres. It will be strat five and you will have overtake on each of the straights, one lap remaining. Safety Car at turn 15 now.')
    .start();
