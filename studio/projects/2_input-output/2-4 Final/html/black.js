// page 
const colors = ['#16344e', '#417b87', '#440f0f', '#50677c', '#4c1130', '#1b3144'];

let colorIndex = 0;
let directionRight = true;
let directionDown = true;

const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvas 
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// background transitions 
function triggerBackgroundTransition(key) {
  const color = colors[colorIndex % colors.length];

  // x key 
  if (key === 'x') {
    const newBg = document.createElement('div');
    newBg.classList.add('bg');
    newBg.style.backgroundColor = color;
    newBg.classList.add(directionRight ? 'from-right' : 'from-left');
    container.appendChild(newBg);

    requestAnimationFrame(() => {
      newBg.classList.add('slide-in', 'to-center');
    });
    directionRight = !directionRight;
  }

  // t key 
  if (key === 't') {
    const newBg = document.createElement('div');
    newBg.classList.add('bg');
    newBg.style.backgroundColor = color;
    newBg.classList.add(directionDown ? 'from-bottom' : 'from-top');
    container.appendChild(newBg);

    requestAnimationFrame(() => {
      newBg.classList.add('slide-in', 'to-center');
    });
    directionDown = !directionDown;
  }

  // p key 
  if (key === 'p') {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.backgroundColor = color;
    container.appendChild(circle);

    requestAnimationFrame(() => {
      circle.style.width = '3000px';
      circle.style.height = '3000px';
    });

    setTimeout(() => {
      const newBg = document.createElement('div');
      newBg.classList.add('bg');
      newBg.style.backgroundColor = color;
      container.appendChild(newBg);

      const bgs = container.querySelectorAll('.bg');
      if (bgs.length > 1) container.removeChild(bgs[0]);
      container.removeChild(circle);
    }, 800);
  }

  if (['x', 't', 'p'].includes(key)) colorIndex++;
}

// animation set up 
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// a key 
let aLines = [];
const aLineDrawSpeed = 0.02, aLineRetractSpeed = 0.02, aLineWaitTime = 1500;
function addALine() {
  const x1 = randomInt(0, canvas.width);
  const y1 = randomInt(0, canvas.height);
  const x2 = randomInt(0, canvas.width);
  const y2 = randomInt(0, canvas.height);
  const lineColors = ['#16344e', '#417b87', '#440f0f', '#50677c', '#4c1130', '#1b3144'];
  const color = lineColors[randomInt(0, lineColors.length - 1)];
  aLines.push({ x1, y1, x2, y2, color, state: 'drawing', progress: 0, waitEndTime: null });
}

// s key 
let sGroup = null, sDirection = 1;
const sGroupSpeed = 0.02, sGroupWaitTime = 1500;
function createSGroup(direction) {
  const lineLength = canvas.width * 0.4;
  const centerX = canvas.width / 2;
  const startX = centerX - lineLength / 2;
  const endX = centerX + lineLength / 2;
  const centerY = canvas.height / 2;
  const spacing = 100;
  return { direction, progress: 0, state: 'drawing', waitEndTime: null, startX, endX, centerY, spacing };
}

// d key 
let dWave = null, dDirection = 1;
const dWaveSpeed = 0.02, dWaveWaitTime = 1500;
function createDWave(direction) {
  const margin = 50;
  let startX, endX;
  if (direction === 1) {
    startX = margin;
    endX = canvas.width - margin;
  } else {
    startX = canvas.width - margin;
    endX = margin;
  }
  return {
    direction, progress: 0, state: 'drawing', waitEndTime: null,
    startX, endX, centerY: canvas.height / 2, amplitude: 80, frequency: 3
  };
}

// f key 
let fCircle = null, fDirection = 1;
const fCircleSpeed = 0.02, fCircleWaitTime = 1500;
function createFCircle(direction) {
  const diameter = canvas.width * 0.6;
  const radius = diameter / 2;
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  return { direction, progress: 0, state: 'drawing', waitEndTime: null, center, radius, startAngle: -Math.PI / 2 };
}

// g key 
let gCircles = [];
const gCircleSpeed = 0.02, gCircleRetractSpeed = 0.02, gCircleWaitTime = 1500;
function createGCircle() {
  const centerX = canvas.width / 2, centerY = canvas.height / 2;
  const regionWidth = canvas.width * 0.4, regionHeight = canvas.height * 0.4;
  const maxAttempts = 10;
  let attempts = 0, newCircle = null;
  while (attempts < maxAttempts) {
    const x = centerX - regionWidth / 2 + Math.random() * regionWidth;
    const y = centerY - regionHeight / 2 + Math.random() * regionHeight;
    const targetRadius = 10 + Math.random() * 90;
    let overlap = false;
    for (let circle of gCircles) {
      const dx = x - circle.center.x, dy = y - circle.center.y;
      if (Math.sqrt(dx*dx + dy*dy) < targetRadius + circle.targetRadius) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      newCircle = { center: { x, y }, targetRadius, progress: 0, state: 'gDrawing', waitEndTime: null };
      break;
    }
    attempts++;
  }
  return newCircle;
}

// h key 
let hDrops = [];
function addHDrops() {
  for (let i = 0; i < 10; i++) {
    const regionWidth = canvas.width * 0.4;
    const x = canvas.width / 2 - regionWidth / 2 + Math.random() * regionWidth;
    const y = -randomInt(10, 100);
    const length = randomInt(10, 20);
    const speed = randomInt(4, 8);
    hDrops.push({ x, y, length, speed });
  }
}

// j key 
let jLines = [];
const jLineSpeed = 0.02, jLineWaitTime = 1500;
function createJLine() {
  const direction = Math.random() < 0.5 ? 1 : -1;
  const x = randomInt(0, canvas.width);
  let startY, endY;
  const lineLength = randomInt(50, Math.floor(canvas.height / 2));
  if (direction === 1) {
    startY = 0;
    endY = startY + lineLength;
  } else {
    startY = canvas.height;
    endY = startY - lineLength;
  }
  return { x, startY, endY, progress: 0, state: 'jDrawing', waitEndTime: null, direction };
}
function drawJLine(line) {
  const currentY = line.startY + (line.endY - line.startY) * line.progress;
  ctx.beginPath();
  ctx.moveTo(line.x, line.startY);
  ctx.lineTo(line.x, currentY);
  ctx.stroke();
}

// k key 
let kTriangle = null, kDirection = 1;
const kTriangleSpeed = 0.02, kTriangleWaitTime = 1500;
function createKTriangle(direction) {
  const posX = direction === 1 ? canvas.width * 0.65 : canvas.width * 0.35;
  const posY = canvas.height / 2;
  const targetWidth = canvas.width * 0.4;
  const targetHeight = canvas.height * 0.3;
  return { center: { x: posX, y: posY }, targetWidth, targetHeight, progress: 0, state: 'kDrawing', waitEndTime: null, direction };
}
function drawKTriangle(triangle) {
  const w = triangle.targetWidth, h = triangle.targetHeight, progress = triangle.progress;
  let A, B, C;
  if (triangle.direction === 1) {
    A = { x: -w/2 * progress, y: -h/2 * progress };
    B = { x: -w/2 * progress, y:  h/2 * progress };
    C = { x:  w/2 * progress,  y:  0 };
  } else {
    A = { x:  w/2 * progress, y: -h/2 * progress };
    B = { x:  w/2 * progress, y:  h/2 * progress };
    C = { x: -w/2 * progress, y:  0 };
  }
  ctx.save();
  ctx.translate(triangle.center.x, triangle.center.y);
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

// l key 
let lBlobs = [];
const lBlobSpeed = 0.02, lBlobRetractSpeed = 0.02, lBlobWaitTime = 1500;
const lBlobMinRadius = 100, lBlobMaxRadius = 250, lBlobVertices = 24;
function createLBlob() {
  const x = randomInt(0, canvas.width);
  const y = randomInt(0, canvas.height);
  const targetRadius = randomInt(lBlobMinRadius, lBlobMaxRadius);
  for (let blob of lBlobs) {
    const dx = x - blob.center.x, dy = y - blob.center.y;
    if (Math.sqrt(dx*dx + dy*dy) < targetRadius + blob.targetRadius) return null;
  }
  const noise = [];
  for (let i = 0; i < lBlobVertices; i++) {
    noise.push(0.8 + Math.random() * 0.4);
  }
  return { center: { x, y }, targetRadius, progress: 0, state: 'lDrawing', waitEndTime: null, noise };
}
function drawLBlob(blob) {
  const radius = blob.progress * blob.targetRadius;
  const vertices = [];
  for (let i = 0; i < lBlobVertices; i++) {
    const angle = (i / lBlobVertices) * 2 * Math.PI;
    const r = radius * blob.noise[i];
    const bx = blob.center.x + r * Math.cos(angle);
    const by = blob.center.y + r * Math.sin(angle);
    vertices.push({ x: bx, y: by });
  }
  ctx.beginPath();
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const mid = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
    if (i === 0) ctx.moveTo(mid.x, mid.y);
    else ctx.quadraticCurveTo(current.x, current.y, mid.x, mid.y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fill();
}

// q key 
let qSnowflakes = [];
function addQSnowflakes() {
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = -randomInt(10, 50);
    const radius = randomInt(3, 8);
    const speed = randomInt(1, 3);
    const drift = (Math.random() - 0.5) * 0.5;
    qSnowflakes.push({ x, y, radius, speed, drift });
  }
}

// w key 
let wFeathers = [];
function addWFeathers() {
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = -randomInt(10, 50);
    const size = randomInt(20, 50);
    const speed = randomInt(1, 2);
    const drift = (Math.random() - 0.5) * 1;
    const rotation = Math.random() * 2 * Math.PI;
    const rotationSpeed = (Math.random() - 0.5) * 0.05;
    wFeathers.push({ x, y, size, speed, drift, rotation, rotationSpeed });
  }
}
function drawWFeather(feather) {
  ctx.save();
  ctx.translate(feather.x, feather.y);
  ctx.rotate(feather.rotation);
  const width = feather.size / 4;
  const height = feather.size;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(width, height/2, 0, height);
  ctx.quadraticCurveTo(-width, height/2, 0, 0);
  ctx.closePath();
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.restore();
}

// e key
let eRibbons = [];
const eSpeed = 0.02, eWaitTime = 1500;
function createERibbon() {
  const startX = 0, endX = canvas.width;
  const centerY = canvas.height / 2 + (Math.random() - 0.5) * 100;
  const amplitude = 30 + Math.random() * 20;
  return { startX, endX, centerY, amplitude, progress: 0, state: 'eDrawing', waitEndTime: null };
}
function drawERibbon(ribbon) {
  ctx.beginPath();
  for (let x = ribbon.startX; x <= ribbon.startX + (ribbon.endX - ribbon.startX) * ribbon.progress; x += 5) {
    const t = (x - ribbon.startX) / (ribbon.endX - ribbon.startX);
    const y = ribbon.centerY + ribbon.amplitude * Math.sin(t * 2 * Math.PI);
    if (x === ribbon.startX) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// r key 
let rStars = [];
const rSpeed = 0.02, rWaitTime = 1500;
function createRStar() {
  const center = { x: canvas.width/2, y: canvas.height/2 };
  const targetRadius = 400;
  const points = 5;
  return { center, targetRadius, points, progress: 0, state: 'rDrawing', waitEndTime: null, rotation: 0 };
}
function drawRStar(star) {
  const cx = star.center.x, cy = star.center.y;
  const outerRadius = star.progress * star.targetRadius;
  const innerRadius = outerRadius / 2;
  const numPoints = star.points;
  const angleStep = Math.PI / numPoints;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(star.rotation);
  ctx.beginPath();
  for (let i = 0; i < 2 * numPoints; i++) {
    const angle = i * angleStep;
    const r = (i % 2 === 0) ? outerRadius : innerRadius;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

let cSquares = [];
let vRipples = [];
let bWaves = [];

function createCSquare() {
  const size = 20 + Math.random() * 60;
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const color = colors[Math.floor(Math.random() * colors.length)];
  cSquares.push({ x, y, size, alpha: 1, color });
}

function createVRipple() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const color = colors[Math.floor(Math.random() * colors.length)];
  vRipples.push({ x, y, radius: 0, maxRadius: 150, alpha: 1, color });
}

function createBWave() {
  const y = Math.random() * canvas.height;
  const amplitude = 20 + Math.random() * 40;
  const frequency = 0.02 + Math.random() * 0.02;
  const speed = 2 + Math.random() * 3;
  const color = colors[Math.floor(Math.random() * colors.length)];
  bWaves.push({ y, amplitude, frequency, speed, offset: 0, color });
}

let yFireworks = [];
let uOrbiters = [];
let iPolygons = [];
let oRings = [];

// y key 
function createYFirework() {
  const centerX = Math.random() * canvas.width;
  const centerY = Math.random() * canvas.height;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const numParticles = 30 + Math.floor(Math.random() * 20); // up to 50
  for (let i=0; i < numParticles; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = 2 + Math.random() * 6;
    yFireworks.push({
      x: centerX,
      y: centerY,
      dx: Math.cos(angle)*speed,
      dy: Math.sin(angle)*speed,
      alpha: 1,
      color
    });
  }
}

// u key 
function createUOrbiters() {
  const centerX = canvas.width/2;
  const centerY = canvas.height/2;
  const color = colors[Math.floor(Math.random()*colors.length)];
  for (let i=0; i<5; i++){
    const radius = (50 + Math.random()*100) * 3;
    const angle = Math.random()*Math.PI*2;
    uOrbiters.push({
      cx: centerX,
      cy: centerY,
      radius,
      angle,
      speed: 0.02 + Math.random()*0.02,
      color,
      alpha: 1
    });
  }
}

// i key
function createIPolygon() {
  const centerX = canvas.width/2;
  const centerY = canvas.height/2;
  const color = colors[Math.floor(Math.random()*colors.length)];
  iPolygons.push({
    cx: centerX,
    cy: centerY,
    sides: 3 + Math.floor(Math.random()*5), // 3-7 sides
    size: 0,
    maxSize: 150 * 3,
    alpha: 1,
    color
  });
}
function drawPolygon(cx, cy, sides, radius, color, alpha) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i=0; i<sides; i++) {
    const angle = (i/sides) * 2 * Math.PI;
    const px = radius*Math.cos(angle);
    const py = radius*Math.sin(angle);
    if(i===0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

// o key 
function createORing() {
  const centerX = canvas.width/2;
  const centerY = canvas.height/2;
  const color = colors[Math.floor(Math.random()*colors.length)];
  oRings.push({
    x: centerX,
    y: centerY,
    radius: 0,
    maxRadius: 200 * 3,
    alpha: 1,
    color
  });
}

// animation 
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();

  // a key 
  for (let i = aLines.length - 1; i >= 0; i--) {
    let line = aLines[i];
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);

    if (line.state === 'drawing') {
      line.progress += aLineDrawSpeed;
      if (line.progress >= 1) {
        line.progress = 1;
        line.state = 'waiting';
        line.waitEndTime = now + aLineWaitTime;
      }
      let currentX = line.x1 + (line.x2 - line.x1)*line.progress;
      let currentY = line.y1 + (line.y2 - line.y1)*line.progress;
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }
    else if (line.state === 'waiting') {
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
      if (now >= line.waitEndTime) {
        line.state = 'retracting';
        line.progress = 0;
      }
    }
    else if (line.state === 'retracting') {
      line.progress += aLineRetractSpeed;
      if (line.progress >= 1) {
        aLines.splice(i, 1);
        continue;
      }
      let currentX = line.x2 - (line.x2 - line.x1)*line.progress;
      let currentY = line.y2 - (line.y2 - line.y1)*line.progress;
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }
  }

  // s key 
  if (sGroup) {
    ctx.lineWidth = 40;
    ctx.strokeStyle = '#000000';
    if (sGroup.state === 'drawing') {
      sGroup.progress += sGroupSpeed;
      if (sGroup.progress >= 1) {
        sGroup.progress = 1;
        sGroup.state = 'waiting';
        sGroup.waitEndTime = now + sGroupWaitTime;
      }
    } else if (sGroup.state === 'waiting') {
      if (now >= sGroup.waitEndTime) {
        sGroup.state = 'retracting';
      }
    } else if (sGroup.state === 'retracting') {
      sGroup.progress -= sGroupSpeed;
      if (sGroup.progress <= 0) {
        sGroup = null;
      }
    }
    if (sGroup) {
      if (sGroup.direction === 1) {
        const currentX = sGroup.startX + (sGroup.endX - sGroup.startX)*sGroup.progress;
        for (let offset of [-sGroup.spacing, 0, sGroup.spacing]) {
          ctx.beginPath();
          ctx.moveTo(sGroup.startX, sGroup.centerY + offset);
          ctx.lineTo(currentX, sGroup.centerY + offset);
          ctx.stroke();
        }
      } else {
        const currentX = sGroup.endX - (sGroup.endX - sGroup.startX)*sGroup.progress;
        for (let offset of [-sGroup.spacing, 0, sGroup.spacing]) {
          ctx.beginPath();
          ctx.moveTo(sGroup.endX, sGroup.centerY + offset);
          ctx.lineTo(currentX, sGroup.centerY + offset);
          ctx.stroke();
        }
      }
    }
  }

  // d key 
  if(dWave){
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#000000';
    if(dWave.state==='drawing') {
      dWave.progress += dWaveSpeed;
      if(dWave.progress>=1){
        dWave.progress=1;
        dWave.state='waiting';
        dWave.waitEndTime= now + dWaveWaitTime;
      }
    } else if(dWave.state==='waiting') {
      if(now >= dWave.waitEndTime) dWave.state='retracting';
    } else if(dWave.state==='retracting') {
      dWave.progress -= dWaveSpeed;
      if(dWave.progress<=0) dWave=null;
    }
    if(dWave){
      const currentX = dWave.startX + (dWave.endX - dWave.startX)*dWave.progress;
      ctx.beginPath();
      const step=5;
      if(dWave.direction===1) {
        for(let x=dWave.startX; x<=currentX; x+=step){
          const t = (x - dWave.startX)/(dWave.endX - dWave.startX);
          const y = dWave.centerY + dWave.amplitude*Math.sin(2*Math.PI*dWave.frequency*t);
          if(x===dWave.startX) ctx.moveTo(x,y);
          else ctx.lineTo(x,y);
        }
      } else {
        for(let x=dWave.startX; x>=currentX; x-=step){
          const t = (x - dWave.startX)/(dWave.endX - dWave.startX);
          const y = dWave.centerY + dWave.amplitude*Math.sin(2*Math.PI*dWave.frequency*t);
          if(x===dWave.startX) ctx.moveTo(x,y);
          else ctx.lineTo(x,y);
        }
      }
      ctx.stroke();
    }
  }

  // f key 
  if(fCircle){
    ctx.lineWidth=2;
    ctx.strokeStyle='#000000';
    if(fCircle.state==='drawing'){
      fCircle.progress+= fCircleSpeed;
      if(fCircle.progress>=1){
        fCircle.progress=1;
        fCircle.state='waiting';
        fCircle.waitEndTime= now + fCircleWaitTime;
      }
    } else if(fCircle.state==='waiting') {
      if(now>= fCircle.waitEndTime) fCircle.state='retracting';
    } else if(fCircle.state==='retracting') {
      fCircle.progress-= fCircleSpeed;
      if(fCircle.progress<=0) fCircle=null;
    }
    if(fCircle){
      ctx.beginPath();
      if(fCircle.direction===1){
        ctx.arc(
          fCircle.center.x, fCircle.center.y,
          fCircle.radius*fCircle.progress,
          fCircle.startAngle,
          fCircle.startAngle + fCircle.progress*2*Math.PI
        );
      } else {
        ctx.arc(
          fCircle.center.x, fCircle.center.y,
          fCircle.radius*fCircle.progress,
          fCircle.startAngle,
          fCircle.startAngle - fCircle.progress*2*Math.PI,
          true
        );
      }
      ctx.stroke();
    }
  }

  // g key 
  if(gCircles.length>0){
    ctx.lineWidth=2;
    ctx.strokeStyle='#000000';
    for(let i=gCircles.length-1; i>=0; i--){
      let circle=gCircles[i];
      if(circle.state==='gDrawing'){
        circle.progress+= gCircleSpeed;
        if(circle.progress>=1){
          circle.progress=1;
          circle.state='gWaiting';
          circle.waitEndTime= now + gCircleWaitTime;
        }
      } else if(circle.state==='gWaiting'){
        if(now>= circle.waitEndTime) circle.state='gRetracting';
      } else if(circle.state==='gRetracting'){
        circle.progress-=gCircleRetractSpeed;
        if(circle.progress<=0){
          gCircles.splice(i,1);
          continue;
        }
      }
      const radius = circle.progress*circle.targetRadius;
      ctx.beginPath();
      ctx.arc(circle.center.x,circle.center.y,radius,0,2*Math.PI);
      ctx.stroke();
    }
  }

  // h key 
  if(hDrops.length>0){
    ctx.lineWidth=2;
    ctx.strokeStyle='#000000';
    for(let i=hDrops.length-1; i>=0; i--){
      let drop=hDrops[i];
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();
      drop.y+= drop.speed;
      if(drop.y>canvas.height) hDrops.splice(i,1);
    }
  }

  // j key 
  if(jLines.length>0){
    ctx.lineWidth=4;
    ctx.strokeStyle='#000000';
    for(let i=jLines.length-1; i>=0; i--){
      let jLine=jLines[i];
      if(jLine.state==='jDrawing'){
        jLine.progress+= jLineSpeed;
        if(jLine.progress>=1){
          jLine.progress=1;
          jLine.state='jWaiting';
          jLine.waitEndTime= now + jLineWaitTime;
        }
      } else if(jLine.state==='jWaiting'){
        if(now>= jLine.waitEndTime) jLine.state='jRetracting';
      } else if(jLine.state==='jRetracting'){
        jLine.progress-= jLineSpeed;
        if(jLine.progress<=0){
          jLines.splice(i,1);
          continue;
        }
      }
      drawJLine(jLine);
    }
  }

  // k key 
  if(kTriangle){
    ctx.lineWidth=4;
    ctx.strokeStyle='#000000';
    if(kTriangle.state==='kDrawing'){
      kTriangle.progress+=kTriangleSpeed;
      if(kTriangle.progress>=1){
        kTriangle.progress=1;
        kTriangle.state='kWaiting';
        kTriangle.waitEndTime= now + kTriangleWaitTime;
      }
    } else if(kTriangle.state==='kWaiting'){
      if(now>= kTriangle.waitEndTime) kTriangle.state='kRetracting';
    } else if(kTriangle.state==='kRetracting'){
      kTriangle.progress-=kTriangleSpeed;
      if(kTriangle.progress<=0) kTriangle=null;
    }
    if(kTriangle) drawKTriangle(kTriangle);
  }

  // l key 
  if(lBlobs.length>0){
    for(let i=lBlobs.length-1; i>=0; i--){
      let blob = lBlobs[i];
      if(blob.state==='lDrawing'){
        blob.progress+= lBlobSpeed;
        if(blob.progress>=1){
          blob.progress=1;
          blob.state='lWaiting';
          blob.waitEndTime= now + lBlobWaitTime;
        }
      } else if(blob.state==='lWaiting'){
        if(now>= blob.waitEndTime) blob.state='lRetracting';
      } else if(blob.state==='lRetracting'){
        blob.progress-= lBlobRetractSpeed;
        if(blob.progress<=0){
          lBlobs.splice(i,1);
          continue;
        }
      }
      drawLBlob(blob);
    }
  }

  // q key 
  if(qSnowflakes.length>0){
    ctx.fillStyle='#000000';
    for(let i=qSnowflakes.length-1; i>=0; i--){
      let flake= qSnowflakes[i];
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, 2*Math.PI);
      ctx.fill();
      flake.y+= flake.speed;
      flake.x+= flake.drift;
      if(flake.y-flake.radius>canvas.height){
        qSnowflakes.splice(i,1);
      }
    }
  }

  // w key 
  if(wFeathers.length>0){
    for(let i=wFeathers.length-1; i>=0; i--){
      let feather= wFeathers[i];
      feather.y+= feather.speed;
      feather.x+= feather.drift;
      feather.rotation+= feather.rotationSpeed;
      drawWFeather(feather);
      if(feather.y- feather.size> canvas.height){
        wFeathers.splice(i,1);
      }
    }
  }

  // e key 
  if(eRibbons.length>0){
    for(let i=eRibbons.length-1; i>=0; i--){
      let ribbon=eRibbons[i];
      if(ribbon.state==='eDrawing'){
        ribbon.progress+= eSpeed;
        if(ribbon.progress>=1){
          ribbon.progress=1;
          ribbon.state='eWaiting';
          ribbon.waitEndTime= now + eWaitTime;
        }
      } else if(ribbon.state==='eWaiting'){
        if(now>= ribbon.waitEndTime) ribbon.state='eRetracting';
      } else if(ribbon.state==='eRetracting'){
        ribbon.progress-= eSpeed;
        if(ribbon.progress<=0){
          eRibbons.splice(i,1);
          continue;
        }
      }
      drawERibbon(ribbon);
    }
  }

  // r key 
  if(rStars.length>0){
    for(let i=rStars.length-1; i>=0; i--){
      let star= rStars[i];
      if(star.state==='rDrawing'){
        star.progress+= rSpeed;
        if(star.progress>=1){
          star.progress=1;
          star.state='rWaiting';
          star.waitEndTime= now + rWaitTime;
        }
      } else if(star.state==='rWaiting'){
        if(now>= star.waitEndTime) star.state='rRetracting';
      } else if(star.state==='rRetracting'){
        star.progress-= rSpeed;
        if(star.progress<=0){
          rStars.splice(i,1);
          continue;
        }
      }
      star.rotation+=0.05;
      drawRStar(star);
    }
  }

  // c key 
  for (let i = cSquares.length - 1; i >= 0; i--) {
    const s = cSquares[i];
    ctx.fillStyle = s.color;
    ctx.globalAlpha = s.alpha;
    ctx.fillRect(s.x - s.size/2, s.y - s.size/2, s.size, s.size);
    ctx.globalAlpha = 1;
    s.alpha -= 0.02;
    if (s.alpha <= 0) cSquares.splice(i, 1);
  }

  // v key 
  for (let i = vRipples.length - 1; i >= 0; i--) {
    const r = vRipples[i];
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(255,255,255,${r.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    r.radius += 4;
    r.alpha -= 0.02;
    if (r.alpha <= 0) vRipples.splice(i, 1);
  }

  // b key 
  for (let i = bWaves.length - 1; i >= 0; i--) {
    const w = bWaves[i];
    w.offset += w.speed;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 10) {
      const waveY = w.y + Math.sin((x + w.offset) * w.frequency) * w.amplitude;
      if (x === 0) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    w.amplitude *= 0.98;
    if (w.amplitude < 2) bWaves.splice(i, 1);
  }

  // y key 
  for (let i=yFireworks.length-1; i>=0; i--){
    const fw = yFireworks[i];
    fw.x += fw.dx;
    fw.y += fw.dy;
    fw.alpha -= 0.02;
    ctx.beginPath();
    ctx.globalAlpha=fw.alpha;
    ctx.fillStyle=fw.color;
    ctx.arc(fw.x, fw.y, 3, 0, 2*Math.PI);
    ctx.fill();
    ctx.globalAlpha=1;
    if(fw.alpha<=0) yFireworks.splice(i,1);
  }

  // u key 
  for(let i=uOrbiters.length-1; i>=0; i--){
    const orb = uOrbiters[i];
    orb.angle += orb.speed;
    const ox= orb.cx + Math.cos(orb.angle)* orb.radius;
    const oy= orb.cy + Math.sin(orb.angle)* orb.radius;
    orb.alpha -= 0.005;
    ctx.beginPath();
    ctx.globalAlpha=orb.alpha;
    ctx.fillStyle=orb.color;
    ctx.arc(ox, oy, 6, 0,2*Math.PI);
    ctx.fill();
    ctx.globalAlpha=1;
    if(orb.alpha<=0) uOrbiters.splice(i,1);
  }

//i key
  for(let i=iPolygons.length-1; i>=0; i--){
    const poly = iPolygons[i];
    poly.size += 2;
    poly.alpha -= 0.01;
    if(poly.size> poly.maxSize || poly.alpha<=0){
      iPolygons.splice(i,1);
      continue;
    }
    drawPolygon(poly.cx, poly.cy, poly.sides, poly.size, poly.color, poly.alpha);
  }

// o key 
  for(let i=oRings.length-1; i>=0; i--){
    const ring = oRings[i];
    ring.radius += 4;
    ring.alpha -= 0.02;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, 2*Math.PI);
    ctx.strokeStyle = `rgba(255,255,255,${ring.alpha})`;
    ctx.lineWidth=3;
    ctx.stroke();
    if(ring.radius> ring.maxRadius || ring.alpha<=0) oRings.splice(i,1);
  }

  requestAnimationFrame(animate);
}
animate();

//eventlistener 

var audioElement = document.querySelector('audio');

document.addEventListener('keydown', (e) => {
  
    const instructionOverlay = document.getElementById('instruction-overlay');
    document.addEventListener('keydown', () => {
      if (instructionOverlay) {
        instructionOverlay.classList.add('hidden');
        setTimeout(() => instructionOverlay.remove(), 600);
      }
    }, { once: true });
    
    if (audioElement.paused) {
        audioElement.play();
    }
  
    const key = e.key.toLowerCase();

  triggerBackgroundTransition(key);

  if (key === 'a') { addALine(); }
  else if (key === 's') {
    if (sGroup) { sGroup.state = 'retracting'; }
    else { sGroup = createSGroup(sDirection); sDirection *= -1; }
  }
  else if (key === 'd') {
    if (dWave) { dWave.state = 'retracting'; }
    else { dWave = createDWave(dDirection); dDirection *= -1; }
  }
  else if (key === 'f') {
    if (fCircle) { fCircle.state = 'retracting'; }
    else { fCircle = createFCircle(fDirection); fDirection *= -1; }
  }
  else if (key === 'g') {
    const newG = createGCircle();
    if (newG) gCircles.push(newG);
  }
  else if (key === 'h') { addHDrops(); }
  else if (key === 'j') { jLines.push(createJLine()); }
  else if (key === 'k') {
    if (kTriangle) { kTriangle.state = 'kRetracting'; }
    else { kTriangle = createKTriangle(kDirection); kDirection *= -1; }
  }
  else if (key === 'l') {
    const newBlob = createLBlob();
    if (newBlob) lBlobs.push(newBlob);
  }

  // top row keys 
  else if (key === 'q') { addQSnowflakes(); }
  else if (key === 'w') { addWFeathers(); }
  else if (key === 'e') { eRibbons.push(createERibbon()); }
  else if (key === 'r') { rStars.push(createRStar()); }
  else if (key === 'y') { createYFirework(); }
  else if (key === 'u') { createUOrbiters(); }
  else if (key === 'i') { createIPolygon(); }
  else if (key === 'o') { createORing(); }

  //bottom row keys
  else if (key === 'z') { addHDrops(); }       
  else if (key === 'c') { createCSquare(); }
  else if (key === 'v') { createVRipple(); }
  else if (key === 'b') { createBWave(); }
  else if (key === 'm') { addQSnowflakes(); }  
  else if (key === 'n') { addWFeathers(); }    

});
