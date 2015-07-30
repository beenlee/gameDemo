/**
 * @file game.js
 * @author lidianbin
 *
 */

(function (window, undefined) {
    window.requestAnimationFrame
    || (window.requestAnimationFrame
        = window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame
            || window.mozRequestAnimationFrame
    );
    var bodyW = document.body.clientWidth;
    var bodyH = document.body.clientHeight;

    var isTouch = 'ontouchstart' in window;
    var eStart = isTouch ? 'touchstart' : 'mousedown';
    var eMove = isTouch ? 'touchmove' : 'mousemove';
    var eEnd = isTouch ? 'touchend' : 'mouseup';
    var eCancel = isTouch ? 'touchcancel' : 'mouseup';
    
    var then;
    var start;
    var score = 0;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 320 * bodyH / bodyW;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    document.body.appendChild(canvas);
    var activeMoney = [];
    
    var RS = {
        list: {},
        init: function (callback) {
            // this.list.bgImage = new Image();
            /*
            bgImage.onload = function () {
                bgReady = true;
            };
            */
            // this.list.bgImage.src = "images/background.png";
            this.list.cat = new Image();
            this.list.cat.src = 'asset/cat.png';
            this.list.cat.onload = function () {
                this.list.money = [];
                this.list.money[0] = new Image();
                this.list.money[0].src = 'asset/money-0.png';
                this.list.money[0].onload = function () {
                    this.list.money[1] = new Image();
                    this.list.money[1].src = 'asset/money-1.png';
                    this.list.money[1].onload = function () {
                        this.list.money[2] = new Image();
                        this.list.money[2].src = 'asset/money-2.png';
                        this.list.money[2].onload = function () {
                            callback(); 
                        }.bind(this);
                    }.bind(this);
                }.bind(this);
            }.bind(this);
    	}
    
    };

    var cat = {
        elm: {
            'class': 'image',
            'obj': null,
            'x': 10,
            'y': 10,
            'width': 100,
            'height': 100
        },
        reset: function () {

        },
        speed: 200,
        direction: 'none',
        move: function (t) {
            // console.log(this.direction);
            if (this.direction === 'left') {
                this.elm.x -= t * this.speed;
                if (this.elm.x < 0) {
                    this.elm.x = 0;
                }
            }
            else if (this.direction === 'right') {
                this.elm.x += t * this.speed;
                if (this.elm.x > canvas.width - this.elm.width) {
                    this.elm.x = canvas.width - this.elm.width;
                }
            }
            else {

            }

        },
        init: function () {
            this.elm.class = 'image';
            this.elm.obj = RS.list.cat;
            this.elm.x = 10;
            this.elm.y = canvas.height - 110;
            this.elm.width = 100;
            this.elm.height = 100;

            canvas.addEventListener(eStart, function (e) {
            	// console.log(window);
                console.log(e);
                // console.log(e.touches[0].pageX ,'<', document.body.clientWidth / 2 );
                var evt = e.touches ? e.touches[0] : e;
                if (evt.pageX < document.body.clientWidth / 2 ) {
                    this.direction = 'left';
                }
                else {
                    this.direction = 'right';
                }
                
            }.bind(this), false);

            canvas.addEventListener(eMove, function (e) {
                //console.log(e);
                var evt = e.touches ? e.touches[0] : e;
                if (evt.pageX < (document.body.clientWidth / 2)) {
                    this.direction = 'left';
                }
                else {
                    this.direction = 'right';
                }
            }.bind(this), false);
            canvas.addEventListener(eEnd, function (e) {
                //console.log(e);
                this.direction = 'none';
            }.bind(this), false);
        }

    };

    function Money() {
        this.inUse = false;
        this.elm = {
            'class': 'image',
            'obj': null,
            'x': 0,
            'y': 0,
            'width': 50,
            'height': 50
        };
        this.speed = 100;
        this.init = function () {
            this.elm.x = Math.random() * (canvas.width - this.elm.width);
            this.elm.y = 40;
            this.elm.obj = RS.list.money[Math.floor(Math.random() * 3)];
            this.speed = Math.random() * 100 + 50;
        };

        this.spawn = function () {
            this.inUse = true;
        };

        this.clear = function () {
            // this.elm.y = 0;
            this.inUse = false;
            this.init();
        };
    }

    var moneyPool = {
        size: 4,
        pool: [],

        init: function () {
            for (var i = 0; i < this.size; i++) {
                var money = new Money();
                money.init();
                this.pool[i] = money;
            }
        },
        get: function () {
            for (var i = this.size - 1; i >= 0; i--) {
                if (!this.pool[i].inUse) {
                    this.pool[i].spawn();
                    var money = this.pool.pop();
                    this.pool.unshift(money);
                    return money;
                }
            }
            return undefined;
        },
        reset: function () {
            this.pool = [];
        }
    };


    var reset = function () {

    };

    var update = function (modifier) {
        var now = Date.now();
        // console.log(Math.floor(now / 1000) + '---' + Math.floor(then / 1000));
        if (Math.floor(now / 1000) !== Math.floor(then / 1000)) {
            if (activeMoney.length < 4) {
                var money = moneyPool.get();
                if (money) {
                    activeMoney.push(money);
                }
            }
        }
        // cat 走动
        cat.move(modifier);

        var tmpMoney = [];
        var len = activeMoney.length;
        //console.log(activeMoney);
        for (var i = 0; i < len; i++) {
            // 下落
            activeMoney[i].elm.y += modifier * activeMoney[i].speed;
            if (
                activeMoney[i].elm.x + activeMoney[i].elm.width >= cat.elm.x
                && activeMoney[i].elm.x <= cat.elm.x + cat.elm.width
                && activeMoney[i].elm.y + activeMoney[i].elm.height > cat.elm.y
                && activeMoney[i].elm.y <= cat.elm.y + cat.elm.height
            ) {
                activeMoney[i].clear();
                score += 1;
            }
            else if (activeMoney[i].elm.y > canvas.height) {
                activeMoney[i].clear();
            }
            else {
                tmpMoney.push(activeMoney[i]);
            }
        }
        activeMoney = tmpMoney;
    };

    var render = function () {
        // 画背景
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'green';
        ctx.fill();

        // 画主要场景
        var catElm = cat.elm;
        // ctx.beginPath();
        // ctx.lineWidth = '6';
        // ctx.strokeStyle = 'red';
        // ctx.rect(catElm.x, catElm.y, catElm.width, catElm.height);
        // ctx.stroke();
        ctx.drawImage(catElm.obj, catElm.x, catElm.y, catElm.width, catElm.height);

        for (var i = 0; i < activeMoney.length; i++) {
            // ctx.beginPath();
            // ctx.lineWidth = '2';
            // ctx.strokeStyle = 'blue';
            // ctx.rect(activeMoney[i].elm.x, activeMoney[i].elm.y, activeMoney[i].elm.width, activeMoney[i].elm.height);
            // ctx.stroke();
            ctx.drawImage(
                activeMoney[i].elm.obj,
                activeMoney[i].elm.x, activeMoney[i].elm.y,
                activeMoney[i].elm.width, activeMoney[i].elm.height
            );
        }

        // 画得分
        ctx.fillStyle = 'rgb(250, 250, 250)';
        ctx.font = '24px Helvetica';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('得分: ' + score, 32, 32);

        // 画时间
        ctx.fillStyle = 'rgb(250, 250, 250)';
        ctx.font = '24px Helvetica';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('时间: ' + Math.floor((then - start) / 1000), 200, 32);

    };

    var main = function () {
        var now  = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();

        then = now;

        requestAnimationFrame(main);

    };


    RS.init(function () {
        //alert("jiazai");
        reset();
        start = then = Date.now();
        moneyPool.init();
        cat.init();
        main();
    });

})(window);
