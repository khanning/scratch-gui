class InputElement extends PIXI.Container {
    constructor(params) {
        super();
        this._width = params.width;
        this._height = params.height;
        this.x = params.x;
        this.y = params.y;
        this.params = params;
        this.editable = false;
        this.draggable = (this.params.draggable) ? true : false;
        this.createMenu();
    }

    createMenu() {
        this.menu = new PIXI.Container();
        this.menu.visible = false;
        this.button = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.button.tint = 0x8742f5;
        this.button.width = 20;
        this.button.height = 20;
        this.button.x = this._width/2;
        this.button.y = this._height/-2-20;
        this.button.buttonMode = true;
        this.button.interactive = true;
        this.button.on('pointerup', this.close, this);
        this.menu.addChild(this.button);
        this.addChild(this.menu);
    }

    longpressEvent() {
        this.menu.visible = true;
        this.editable = true;
        UI.setActiveElement(this);
    }

    setInactive() {
        this.menu.visible = false;
        this.editable = false;
    }

    touchBegin(e) {
        if (!this.draggable) return;
        this._touchStartX = e.data.getLocalPosition(this).x;
        this._touchStartY = e.data.getLocalPosition(this).y;
        this._longpressTimeout = setTimeout(this.longpressEvent.bind(this), 2000);
    }

    touchEnd() {
        if (this._longpressTimeout) clearTimeout(this._longpressTimeout);
        if (this.editable) return;
        if (this.callback) this.callback();
    }

    onMoveEvent(e) {
        if (this._longpressTimeout) clearTimeout(this._longpressTimeout);
        this._longpressTimeout = setTimeout(this.longpressEvent.bind(this), 2000);
    }

    drag(e) {
        this.x = e.data.global.x - this._touchStartX;
        this.y = e.data.global.y - this._touchStartY;
    }

    close() {
        this.destroy();
    }
}

class Button extends InputElement {
    constructor(params) {
        super(params);
        this.name = params.name;
        this.shape = params.shape;
        this.create();
    }

    create() {
        this.graphics = new PIXI.Graphics();

        if (this.shape === 'square') {
            this.graphics.lineStyle(2, 0xFF00FF, 1);
            this.graphics.beginFill(0x650A5A);
            this.graphics.drawRoundedRect(this._width/-2, this._height/-2, this._height, this._width, 16);
            this.graphics.endFill();
        } else if (this.shape === 'circle') {
            this.graphics.lineStyle(2, 0xFF00FF, 1);
            this.graphics.beginFill(0x650A5A);
            this.graphics.drawCircle(0, 0, this._width/2);
            this.graphics.endFill();
        }
        this.graphics.interactive = true;
        this.addChild(this.graphics);

        this.graphics.on('pointerdown', this.onDown, this);
        this.graphics.on('pointermove', this.onMove, this);
        this.graphics.on('pointerup', this.onUp, this);
    }

    onDown(e) {
        this.touchBegin(e);
        this.isDown = true;
    }

    onMove(e) {
        if (this.isDown && this.editable) {
            this.drag(e);
            return;
        }
    }

    onUp(event) {
        this.touchEnd();
        this.isDown = false;
        if (this.editable) return;
        if (this.onchange) this.onchange();
    }

}

class TouchPad extends InputElement {
    constructor(params) {
        super(params);
        this._scaleFactorX = 480 / this._width;
        this._scaleFactorY = 360 / this._height;
        this.create();
    }

    create() {
        this.bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.bg.anchor.set(0.5);
        this.bg.tint = 0x404040;
        this.bg.width = this._width;
        this.bg.height = this._height;
        this.bg.interactive = true;
        this.addChild(this.bg);

        this.bg.on('pointerdown', this.onDown, this);
        this.bg.on('pointermove', this.onMove, this);
        this.bg.on('pointerup', this.onUp, this);
        this.bg.on('pointerupoutside', this.onUp, this);
    }

    onDown(e) {
        this.touchBegin(e);
        this.isDown = true;
        this.onMove(e);
    }

    onMove(e) {
        if (!this.isDown) return;
        this.onMoveEvent(e);
        if (this.editable) {
            this.drag(e);
            return;
        }
        let x = -240 + Math.round(e.data.getLocalPosition(this).x * this._scaleFactorX);
        x = Math.min(Math.max(x, -240), 240);
        let y = 180 - Math.round(e.data.getLocalPosition(this).y * this._scaleFactorY);
        y = Math.min(Math.max(y, -180), 180);
        this._touchX = x;
        this._touchY = y;
        this.update();
    }

    onUp() {
        this.touchEnd();
        this.isDown = false;
    }

    get touchX() {
        return this._touchX;
    }

    get touchY() {
        return this._touchY;
    }

    update() {
        if (this.onchange) this.onchange([this.touchX, this.touchY]);
    }

}

class Slider extends InputElement {
    constructor(params) {
        super(params);
        this._value = 1;
        this.create();
    }

    create() {
        this.bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.bg.anchor.set(0.5);
        this.bg.tint = 0x404040;
        this.bg.width = this._width;
        this.bg.height = this._height;
        this.bg.interactive = true;
        this.bg.buttonMode = true;
        this.addChild(this.bg);

        this.bg.on('pointerdown', this.onDown, this);
        this.bg.on('pointermove', this.onMove, this);
        this.bg.on('pointerup', this.onUp, this);
        this.bg.on('pointerupoutside', this.onUp, this);

        this.fg = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.fg.anchor.set(0.5);
        this.fg.width = this.bg.width;
        this.fg.height = 50;
        this.addChild(this.fg);

        this.update();
    }

    onDown(e) {
        this.touchBegin(e);
        this.isDown = true;
        this.onMove(e);
    }

    onMove(e) {
        if (!this.isDown) return;
        this.onMoveEvent(e);
        if (this.editable) {
            this.drag(e);
            return;
        }
        const y = e.data.getLocalPosition(this).y;
        this.value = 100 - ((y + this.bg.height/2) / this.bg.height * 100);
    }

    onUp() {
        this.touchEnd();
        this.isDown = false;
    }

    update() {
        this.fg.y = this.bg.height/2 - (this.value * this.bg.height / 100);
        if (this.onchange) this.onchange(this.value);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        val = Math.min(Math.max(val, 0), 100);
        this._value = val;
        this.update();
    }
}

class Stage extends InputElement {
    constructor(params) {
        super(params);
        this.create();
    }

    create() {

        // let bg = new PIXI.Graphics();
        // // bg.lineStyle(2, 0xFF00FF, 1);
        // bg.beginFill(0xFFFFFF);
        // bg.drawRect(0, 0, this._width, this._height, 16);
        // bg.endFill();
        // this.addChild(bg);

        this.stage = new PIXI.Sprite(PIXI.Texture.WHITE)
        this.stage.anchor.set(0.5);
        this.stage.width = this._width;
        this.stage.height = this._height;
        this.stage.interactive = true;
        // this.stage.anchorX = 0.5;
        // this.stage.anchorY = 0.5;
        this.addChild(this.stage);

        this.stage.on('pointerdown', this.onDown, this);
        this.stage.on('pointermove', this.onMove, this);
        this.stage.on('pointerup', this.onUp, this);
        this.stage.on('pointerupoutside', this.onUp, this);
    }

    updateTexture(texture) {
        // let oldTexture = this.stage.texture;
        // texture.rotate = 8;
        this.stage.texture = texture;
        // this.stage.scale.x = 0.5;
        // this.stage.scale.y = -0.5;
        // oldTexture.destroy();
    }

    onDown(e) {
        this.touchBegin(e);
        this.isDown = true;
        this.onMove(e);
    }

    onMove(e) {
        if (!this.isDown) return;
        this.onMoveEvent(e);
        if (this.editable) {
            this.drag(e);
            return;
        }
    }

    onUp() {
        this.touchEnd();
        this.isDown = false;
    }
}

let UI = {
    init () {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            // autoResize: true,
            // resolution: Math.floor(devicePixelRatio),
            resolution: 1,
            // forceCanvas: true,
            backgroundColor: 0x99b898,
            antialiasing: true
        });
        document.body.appendChild(this.app.view);

        // this.app.stage.interactive = true;
        // this.app.stage.on('pointerdown', e => console.log(e));

        this.build();

        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('pointerdown', this.clearActiveElement.bind(this));
        // this.resize();

        this.listeners = [];
    },
    resize () {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        console.log(this.app.renderer);
        console.log(window.innerWidth, window.innerHeight);

        this.gfSprite.x = window.innerWidth - 150;
        this.gfSprite.y = 60;

        this.stopSprite.x = window.innerWidth - 60;
        this.stopSprite.y = 60;
    },
    build () {
        this.gfSprite = PIXI.Sprite.from('assets/green-flag.png');
        this.gfSprite.anchor.set(0.5);
        this.gfSprite.scale.x = 0.15;
        this.gfSprite.scale.y = 0.15;
        this.gfSprite.x = window.innerWidth - 150;
        this.gfSprite.y = 60;
        this.gfSprite.interactive = true;
        this.gfSprite.buttonMode = true;
        this.gfSprite.on('pointerup', e => this.emit({type: 'command', name: 'greenflag'}));
        this.app.stage.addChild(this.gfSprite);

        this.stopSprite = PIXI.Sprite.from('assets/stop-all.png');
        this.stopSprite.anchor.set(0.5);
        this.stopSprite.scale.x = 0.15;
        this.stopSprite.scale.y = 0.15;
        this.stopSprite.x = window.innerWidth - 60;
        this.stopSprite.y = 60;
        this.stopSprite.interactive = true;
        this.stopSprite.buttonMode = true;
        this.stopSprite.on('pointerup', e => this.emit({type: 'command', name: 'stopall'}));
        this.app.stage.addChild(this.stopSprite);

        this.addSprite = PIXI.Sprite.from('assets/add.png');
        this.addSprite.anchor.set(0.5);
        this.addSprite.scale.x = 0.15;
        this.addSprite.scale.y = 0.15;
        this.addSprite.x = window.innerWidth - 250;
        this.addSprite.y = 60;
        this.addSprite.interactive = true;
        this.addSprite.buttonMode = true;
        this.addSprite.on('pointerup', e => {
            console.log('Open add menu');
        });
        this.app.stage.addChild(this.addSprite);

        let input = new PIXI.TextInput({
            input: {
                fontSize: '2em',
                padding: '12px',
                width: '80px',
                color: '#26272E'
            },
            box: {
                default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
                focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
                disabled: {fill: 0xDBDBDB, rounded: 12}
            }
        });
        input.placeholder = '0000';
        input.maxLength = 4;
        input.restrict = '0123456789';
        input.x = input.width/2 + 20;
        input.y = input.height/2 + 20;
        input.pivot.x = input.width/2;
        input.pivot.y = input.height/2;
        this.app.stage.addChild(input);

        let button = new Button({
            name: 'test',
            shape: 'square',
            height: input.height,
            width: input.height,
            x: input.width + 60,
            y: input.height/2 + 20
        });
        button.onchange = e => this.emit({type: 'command', name: 'connect', value: input.text});
        this.app.stage.addChild(button);

        let slider = new Slider({
            width: 100,
            height: 300,
            x: 450,
            y: 235,
            draggable: true
        });
        slider.value = 50;
        slider.onchange = val => this.emit({type: 'sensor', name: 'slider', val: val});
        this.app.stage.addChild(slider);

        let touchPad = new TouchPad({
            width: 300,
            height: 300*.75,
            x: 800,
            y: 250,
            draggable: true
        });
        touchPad.onchange = coords => this.emit({type: 'sensor', name: 'touchpad', val: coords});
        this.app.stage.addChild(touchPad);

        let button2 = new Button({
            name: 'test2',
            shape: 'circle',
            height: 100,
            width: 100,
            // x: window.innerWidth/2,
            x: 575,
            y: 100,
            draggable: true
            // y: window.innerHeight/2
        });
        button2.onchange = () => this.emit({type: 'broadcast', name: 'button 1'});
        this.app.stage.addChild(button2);

        this.stage = new Stage({
            width: 300,
            height: 300*.75,
            x: 200,
            y: 250,
            draggable: true
        });
        this.app.stage.addChild(this.stage);
    },
    updateStage(data) {
        PIXI.utils.clearTextureCache();
        PIXI.Loader.shared.reset();
        PIXI.Loader.shared.add('stage', data);
        PIXI.Loader.shared.load((loader, resources) => {
            this.stage.updateTexture(resources.stage.texture);
            // console.log(resources)
        });
        // const texture = new PIXI.Texture.fromBuffer(data, 480, 360);
        // console.log(data);
        // const texture = new PIXI.Texture.from(data);
        // if (this.test) return;
        // this.test = true;
        // this.stage.updateTexture(texture);
    },
    emit (event) {
        this.listeners.forEach(c => c(event));
    },
    addEventListener (callback) {
        return this.listeners.push(callback);
    },
    setActiveElement (element) {
        this.activeElement = element;
    },
    clearActiveElement (e) {
        if (this.activeElement) {
            const point = new PIXI.Point(e.clientX, e.clientY);
            const hit = this.app.renderer.plugins.interaction.hitTest(point, this.activeElement);
            if (!hit) {
                this.activeElement.setInactive();
                this.activeElement = null;
            }
        }
    }
};
