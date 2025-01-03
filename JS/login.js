'use strict';

let mouse, originx, originy, int, cvs;

// Safari doesn't support EventTarget
var EventTarget = EventTarget || false;

// addEventListener shorthand
if (EventTarget) {
  EventTarget.prototype.evt = function (event, callback) {
    return this.addEventListener(event, callback);
  }
} else {
  window.evt = function (event, callback) {
    return this.addEventListener(event, callback);
  };
  document.evt = function (event, callback) {
    return this.addEventListener(event, callback);
  };
  Element.prototype.evt = function (event, callback) {
    return this.addEventListener(event, callback);
  };
}

// getElementById shorthand
function $(elemId) {
    return document.getElementById(elemId);
}

function init() {
    cvs = $("canvas");

    resizeCanvas(cvs);

    window.evt('resize', resizeCanvas, false);
    window.evt("mousemove", function (e) {
        mouse = getMousePos(cvs, e);
        originx = mouse.x;
        originy = mouse.y;
      
    });
    // window.evt("touchmove", function (e) {
    //     originx = e.originalEvent.touches[0].pageX;
    //     originy = e.originalEvent.touches[0].pageY;
    // });

    var network = new Field(0, 0, 50);
    var emit = new Emitter(0, 0, 50);
    
    animateCanvas(cvs, function () {
        network.animate();
        emit.animate();
    });
}

// Individual particle
class Point {
    constructor(x, y, canvas, dia) {
        this.canvas = canvas || cvs;
        this.x = x || 0;
        this.y = y || 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = Math.random() * .5 + .2;
        this.angle = Math.random() * 360;
        this.diaSet = dia || 2 + Math.random() * 10;
        this.dia = this.diaSet;
        this.age = 0;
        let hue = Math.floor(Math.random()*360);
        this.fill = 'hsl('+hue+', 95%, 70%)';
        this.line = Math.random() > .5 ? true : false;
    }

    emit(life) {
        let s = this.speed * 2;
        this.angle += Math.random() * 10 - 5;
        this.x += s * Math.cos(this.angle * Math.PI / 180);
        this.y += s * Math.sin(this.angle * Math.PI / 180);
        this.age += 1 / life;
        this.boundary();
    }

    boundary() {
        if (this.x < 0) {
            this.x = this.canvas.width;
        }
        if (this.x > this.canvas.width) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = this.canvas.height;
        }
        if (this.y > this.canvas.height) {
            this.y = 0;
        }
    }

    field(life) {
        let s = this.speed;
        this.angle += Math.random() * 10 - 5;
        this.x += s * Math.cos(this.angle * Math.PI / 180);
        this.y += s * Math.sin(this.angle * Math.PI / 180);
        this.age += 1 / life;
        this.boundary();
    }

    shrink(life) {
        this.dia = (1 - this.age) * this.diaSet;
    }

    draw() {
        let ctx = this.canvas.getContext('2d'),
            x = this.x,
            y = this.y,
            dia = this.dia,
            age = this.age;

        ctx.beginPath();
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.fill;
        ctx.lineWidth = 2;
        ctx.arc(x, y, dia, 0, 2 * Math.PI);
        ctx.closePath();
        
        this.line !== true ? ctx.fill() : ctx.stroke();
    }
}

class ParticleGroup {

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    getPosition(x, y) {
        return {
            x: this.x,
            y: this.y
        };
    }

    spawn(x, y, amount, dia) {

        var arr = [];
        dia = dia || false;

        amount = amount || 1;

        if (amount > 1) {
            for (let i = 0; i < amount; i++) {
                if (dia) {
                    arr.push(new Point(x, y, cvs, dia));
                }
                else {
                    arr.push(new Point(x, y, cvs));
                }
                
            }
        } else {
            arr = new Point(x, y, cvs, dia);
        }

        return arr;
    }
}

// Particle Emitter
class Emitter extends ParticleGroup {
    constructor(x, y, life, mouse, dia) {
        super();

        if (mouse === undefined) {
            this.mouse = true;
        } else {
            this.mouse = mouse;
        }

        this.particles = [];
        this.x = x || 0;
        this.y = y || 0;
        this.life = life || 20;
        this.canvas = cvs;
        this.dia = dia || false;
    }

    animate() {
        let particles = this.particles;
        if (this.mouse) {
            this.setPosition(originx, originy);
        }

        let mul = 1;

        for (let i = 0; i < mul; i++) {
            particles.push(this.spawn(this.x, this.y, 1));
        }
        
        if (particles.length > this.life * mul) {
            for (let i = 0; i < mul; i++) {
                particles.shift();
            }
        }

        this.render(this.canvas);
    }
    
    render() {
        let life = this.life;
        let ctx = this.canvas.getContext('2d');
        let particles = this.particles;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.draw();
            p.emit(this.life);
            p.shrink();
        }
    }
}

// Particle Field
class Field extends ParticleGroup {
    constructor(x, y, life) {
        super();
        this.particles = [];
        this.canvas = cvs;
        this.x = x || 0;
        this.y = y || 0;
        this.life = life;

        for (let i = 0; i < this.life; i++) {
            let x = Math.random() * cvs.width,
                y = Math.random() * cvs.height;

            this.particles.push(this.spawn(x, y, 1));
        }
    }

    animate() {
        this.render(canvas);
    }

    render(canvas) {
        let ctx = this.canvas.getContext('2d');
        let particles = this.particles;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.draw();
            p.field(this.life);
        }
    }
}

// get the mouse position relative to the canvas
function getMousePos(cvs, evt) {
    const rect = cvs.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// animate the canvas
function animateCanvas(canvas, callback) {

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    callback();

    requestAnimationFrame(animateCanvas.bind(null, canvas, callback));
}

// Update canvas size to fill window
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    originx = canvas.width / 2;
    originy = canvas.height / 2;
}

init();