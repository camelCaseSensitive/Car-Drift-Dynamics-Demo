// Video discussion: https://www.youtube.com/watch?v=jSjN1_76dTs&lc=UgwpqjViQa3bUdKug1d4AaABAg

let lot;
let carImg;
let track1, track2
function preload() {
  lot = loadImage("parkinglotBig.jpg")
  // carImg = loadImage("charger.png")
//   track1 = loadImage("racetrack.jpg")
//   track2 = loadImage("racetrack2.png")
}

let params = {
    momentum: 1,
    showMomentum: false,
    drift: 1,
    maxSpeed: 6,
    showSpeed: false,
    accel: 1,
    friction: 1,
    fill: true,
    axles: false,
    COR: false,
    powerSteering: true
}

let car = {
  x: 300,
  y: 200,
  th: 0,
  phi: 0.01, // Front tire rotation
  d: 50,
  w: 30,
  speed: 1,
  c: 100,
  tireScale: 1,
  spin: 0,
  draw: function() {
    push()
      // Draw car body
      fill(255, 100, 100)
      translate(this.x, this.y)
      rotate(this.th)
    //   rect(0, 0, this.w, this.d)
      
     if(params.axles){
        // FRONT AXLE
        if(car.phi > 0){
            push()
                translate(this.w/2, -this.d/2)
                rotate(this.phi)
                // if(keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) this.c = this.d / tan(this.phi) + this.w/2
                stroke('rgba(0, 0, 0, 0.5)')
                line(0, 0, 500, 0)
            pop()
        } else {
            push()
                translate(-this.w/2, -this.d/2)
                rotate(this.phi)
                // if(keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) this.c = this.d / tan(this.phi) + this.w/2
                stroke('rgba(0, 0, 0, 0.5)')
                line(0, 0, -500, 0)
            pop()
        }
        // REAR AXLE
        push()
            stroke('rgba(0, 0, 0, 0.5)')
            line(0, this.d/2, this.phi / abs(this.phi) * 500, this.d/2)
        pop()
     }

      // COR Line
      if(params.COR){
        push()
            strokeWeight(2)
            stroke(255, 0, 0)
            line(0, this.d/2, this.c, this.d/2)
            circle(this.c, this.d/2, 10)
        pop()
      }
      

      fill(0)
      // Back tires
      this.spin -= this.speed/50 + sqrt(momentum.x**2 + momentum.y**2)/250;
      push()
        translate(this.w/2, this.d/2)
        push()
          translate(0, 0, 12.5)
          scale(this.tireScale)
          rotateZ(PI/2)
          // noFill()
          fill(100)
          // noStroke()
          stroke(40)
          rotateY(this.spin)
          cylinder(10, 10)
        pop()
        translate(-this.w, 0)
        translate(0, 0, 12.5)
        scale(this.tireScale)
        rotateZ(PI/2)
        // noFill()
        fill(100)
          // noStroke()
        stroke(40)
        rotateY(this.spin)
        cylinder(10, 10)
      pop()
      // Front tires
      push()
        translate(this.w/2, -this.d/2)
        rotate(this.phi)

        translate(0, 0, 12.5)
        scale(this.tireScale)
        
        rotateZ(PI/2)
        // noFill()
        fill(100)
        // noStroke()
        stroke(40)
        rotateY(this.spin)
        // stroke(255, 0, 0)
        cylinder(10, 10)
        // box(10, 20, 12.5)
        // rect(0, 0, 10, 20)
      pop()
      push()
        translate(-this.w/2, -this.d/2)
        rotate(this.phi)

        translate(0, 0, 12.5)
        scale(this.tireScale)
        rotateZ(PI/2)
        fill(100)
        // noStroke()
        stroke(40)
        
        rotateY(this.spin)
        cylinder(10, 10)
      pop()
    
    if(params.fill) {
        fill(255, 100, 100)
    } else {
        noFill()
    }
    // rect(0, 0, this.w * 1.1, this.d * 1.5)
    translate(0, 0, 25)
    box(this.w * 1.1, this.d * 1.5, 12)
    //   rotate(PI/2 - 3/100)
    //   scale(1.0, 1.2)
    //   image(carImg, 0, 0)
    pop()
  },
  drive: function() {
    // update position of car (x, y)
    this.c = this.d / tan(this.phi) + this.phi / abs(this.phi) * this.w/2
    let cor = {
      x: this.x + 
      this.phi/abs(this.phi)*this.d/2 * sin(-this.phi/abs(this.phi)*this.th) + 
      this.c * cos(this.th),
      y: this.y + 
      this.d/2 * cos(this.th) + 
      this.c * sin(this.th)
    }
    this.th += this.speed/this.c;
    
    // let driftFactor = 100*this.c/abs(this.c) * abs(this.speed) * abs(this.phi) * sqrt(momentum.x**2 + momentum.y**2)/6 / abs(this.c)

    let driftFactor = params.drift * 100*this.c/abs(this.c) * abs(this.speed) * abs(this.phi) / abs(this.c)


    // Drifting
    this.x = cor.x - (this.c + driftFactor) * cos(this.th) - 
      this.phi/abs(this.phi)*this.d/2 * sin(-this.phi/abs(this.phi)*this.th);
    this.y = cor.y - (this.c + driftFactor) * sin(this.th) - 
      this.d/2 * cos(this.th)

    // No Drifting
    // this.x = cor.x - this.c * cos(this.th) - this.phi/abs(this.phi)*this.d/2 * sin(-this.phi/abs(this.phi)*this.th);
    // this.y = cor.y - this.c * sin(this.th) - this.d/2 * cos(this.th)
  }
}

let start = {
  x: 300,
  y: 200
}

function setup() {
  createCanvas(900, 600, WEBGL);
  // perspective(PI / 4.0, width / height, 0.1, 5000);
  car.x = 0;
  car.y = 0;
  start.x = 0;
  start.y = 0;
  rectMode(CENTER)
  // carImg.resize(car.d * 1.5 * 1.1, car.w * 1.1 * 1.1)
  imageMode(CENTER)
  gui = new dat.GUI();
  gui.add(params, "drift", 0, 3)
  gui.add(params, "momentum", 0, 3)
  gui.add(params, "showMomentum")
  gui.add(params, "maxSpeed", 1, 10)
  gui.add(params, "showSpeed")
  gui.add(params, "accel", 0, 5)
  gui.add(params, "friction", 0.95, 1)
  gui.add(params, "fill")
  gui.add(params, "axles")
  gui.add(params, "COR")
  gui.add(params, "powerSteering")
//   track2.resize(track1.width*10, track1.height*10)
}

let cones = [[100, 100],[200, 300]]

let tracks = []

let momentum = {
    x: 0,
    y: 0,
    prevx: 0, 
    prevy: 0
}

let cam3D = false;

function draw() {
  // background(lot);
  // lights()
  
  translate(-(car.x - start.x), -(car.y - start.y))
  let mMag = sqrt(momentum.x**2 + momentum.y**2)
  // camera(car.x - momentum.x * 10 + 150 * cos(car.th + PI/2), car.y + momentum.y * 10 + 150 * sin(car.th + PI/2), 150, car.x, car.y, 0, 0, 0, -1)
  // camera(car.x + (150 + car.speed*10) * cos(car.th + PI/2) - momentum.x * 5, car.y + (150 + car.speed*10) * sin(car.th + PI/2) + momentum.y * 5, 150, car.x, car.y, 0, 0, 0, -1)
  // camera(car.x + (250 + car.speed*10) * cos(car.th + PI/2) - momentum.x * 2, car.y + (250 + car.speed*10) * sin(car.th + PI/2) + momentum.y * 2, 150, car.x, car.y, 0, 0, 0, -1)
 
  //Good
  // camera(car.x + (150 + mMag*5) * cos(car.th + PI/2) - momentum.x * 5, car.y + (150 + mMag*5) * sin(car.th + PI/2) + momentum.y * 5, 150, car.x, car.y, 0, 0, 0, -1)
  if(cam3D){
    camera(car.x + (150 + mMag*5) * cos(car.th + PI/2) - momentum.x * 5, car.y + (150 + mMag*5) * sin(car.th + PI/2) + momentum.y * 5, 150, car.x, car.y, 0, 0, 0, -1)
  } else {
    camera(car.x , car.y , 450, car.x, car.y, 0, 0, 1, 0)
  }

  // orbitControl()
  
  // rotateX(0.1)
  background(255)
  image(lot, width/2, height/2)
  if(mouseIsPressed){

  }

  // OLD
//   momentum.x += car.speed * cos(car.th)
//   momentum.y += car.speed * sin(car.th)

  momentum.x += car.speed * sin(car.th)/10
  momentum.y += car.speed * cos(car.th)/10

  // params.drift = (sqrt(momentum.x ** 2 + momentum.y ** 2))/20

  if(params.showSpeed){
    push()
        translate(car.x, car.y)
        rotate(car.th)
        stroke(255, 0, 0)
        line(0, 0, 0, -car.speed * 50)
    pop()
  }
  if(params.showMomentum){
    stroke(0, 255, 0)
    line(car.x, car.y, car.x + momentum.x*10, car.y - momentum.y*10)
  }
  
//   circle(car.x, car.y, 20)
//     momentum.x = 0;
//     momentum.y = 0;
//   momentum.x *= (0.95 - abs(car.phi)/2)
//   momentum.y *= (0.95 - abs(car.phi)/2);
  momentum.x *= 0.99 * params.friction
  momentum.y *= 0.99 * params.friction;
//   momentum.x *= (0.1  - abs(car.phi)/2)
//   momentum.y *= (0.1 - abs(car.phi)/2);
//   car.y -= momentum.x/(10 - car.speed);
//   car.x += momentum.y/(10 - car.speed);
  car.x += momentum.x/5 * params.momentum
  car.y -= momentum.y/5 * params.momentum

  if(keyIsDown(RIGHT_ARROW)){
    if(car.phi < PI/4) car.phi += 0.03;
    if(car.phi == 0) car.phi = 0.01;
    car.speed *= 0.999 - abs(car.phi/20)
    car.speed *= 0.999 * params.friction
  } else if(keyIsDown(LEFT_ARROW)){
    if(car.phi > -PI/4) car.phi -= 0.03
    if(car.phi == 0) car.phi = -0.01;
    car.speed *= 0.999 - abs(car.phi/20)
    car.speed *= 0.999 * params.friction
  } else {
    if(abs(car.phi) > 0.01 && params.powerSteering) car.phi *= 0.9
  }
  
  if(keyIsDown(UP_ARROW)){
    if(car.speed < params.maxSpeed) car.speed += 0.09 * params.accel
  } else if(keyIsDown(DOWN_ARROW)) {
    if(car.speed > 0.1) car.speed -= 0.1
    momentum.x *= 0.9 * params.friction
    momentum.y *= 0.9 * params.friction
  } else {
    // car.speed *= 0.995 - abs(car.phi/20)
    car.speed *= 0.995 * params.friction + abs(car.phi)/(PI/3) * (1 - 0.99) 
    momentum.x *= 0.95 + abs(car.phi)/(PI/3) * (1 - 0.99) * params.friction
    momentum.y *= 0.95 + abs(car.phi)/(PI/3) * (1 - 0.99) * params.friction
    // car.speed = sqrt(momentum.x**2 + momentum.y**2)
  }
  
  car.drive()

  // If a drift condition is met add the [x, y] position of the rear axle to the tracks array
  if(abs(car.phi) > 0.5 && (abs(car.speed) > 1 || sqrt(momentum.x**2 + momentum.y**2) > 6)){
    tracks.push([
      car.x + car.d/2 * car.phi/abs(car.phi) * sin(-car.phi/abs(car.phi)*car.th), 
      car.y + car.d/2 * cos(car.th), car.th])
  } 
//   else if (abs(car.phi) > 0.5 && sqrt(momentum.x**2 + momentum.y**2) > 6){
//     tracks.push([
//         car.x + car.d/2 * car.phi/abs(car.phi) * sin(-car.phi/abs(car.phi)*car.th), 
//         car.y + car.d/2 * cos(car.th), car.th])
//     tracks.push([
//         car.x - car.d/2 * car.phi/abs(car.phi) * sin(-car.phi/abs(car.phi)*car.th), 
//         car.y - car.d/2 * cos(car.th), car.th])
//   }

  // Remove the first element of the tracks array if it is greater than 250
  if(tracks.length > 250){
    tracks.shift()
  } 

  // Draw tire tracks
  for(let i = 0; i < tracks.length; i++){
    noFill()
    // Make the tire tracks fade out over time
    stroke('rgba(0, 0, 0,' + i/tracks.length + ')')
    circle(tracks[i][0] + car.w/2 * cos(tracks[i][2]), tracks[i][1] + car.w/2 * sin(tracks[i][2]), 10)
    circle(tracks[i][0] - car.w/2 * cos(tracks[i][2]), tracks[i][1] - car.w/2 * sin(tracks[i][2]), 10)
  }
  car.draw()

  momentum.prevx = momentum.x;
  momentum.prevy = momentum.y;
  
}

function mousePressed(){
  if(mouseX < width) cam3D = !cam3D
}
