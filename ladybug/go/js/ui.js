class Modal {
    constructor() {
        this.create();
    }

    create() {
        this.modalBox = document.createElement('div');
        this.modalBox.classList.add('shadow');
        this.modalBox.addEventListener('pointerdown', this.close.bind(this));
        document.body.appendChild(this.modalBox);

        let contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
        contentContainer.addEventListener('pointerdown', (e) => e.stopPropagation());
        this.modalBox.appendChild(contentContainer);

        this.content = document.createElement('div');
        this.content.classList.add('content');
        contentContainer.appendChild(this.content);

        this.contentContainer = contentContainer;
    }

    close() {
        this.modalBox.remove();
    }
}

class AddModal extends Modal {
    constructor(callback) {
        super();
        this._callback = callback;
        this.createModal();
    }

    createModal() {
        let buttonRow = document.createElement('div');
        buttonRow.classList.add('flex-row');
        buttonRow.onclick = (e) => {
            this._callback('button');
            this.close();
        };
        this.content.appendChild(buttonRow);

        let buttonLabel = document.createElement('div');
        buttonLabel.innerHTML = 'Button';
        buttonLabel.classList.add('add-input-button');
        buttonRow.appendChild(buttonLabel);

        let sliderRow = document.createElement('div');
        sliderRow.classList.add('flex-row');
        this.content.appendChild(sliderRow);
        sliderRow.onclick = (e) => {
            this._callback('slider');
            this.close();
        };

        let sliderLabel = document.createElement('div');
        sliderLabel.innerHTML = 'Slider';
        sliderLabel.classList.add('add-input-button');
        sliderRow.appendChild(sliderLabel);

        let touchpadRow = document.createElement('div');
        touchpadRow.classList.add('flex-row');
        this.content.appendChild(touchpadRow);
        touchpadRow.onclick = (e) => {
            this._callback('touchpad');
            this.close();
        };

        let touchpadLabel = document.createElement('div');
        touchpadLabel.innerHTML = 'TouchPad';
        touchpadLabel.classList.add('add-input-button');
        touchpadRow.appendChild(touchpadLabel);

        let stageRow = document.createElement('div');
        stageRow.classList.add('flex-row');
        this.content.appendChild(stageRow);
        stageRow.onclick = (e) => {
            this._callback('stage');
            this.close();
        };

        let stageLabel = document.createElement('div');
        stageLabel.innerHTML = 'Stage Viewer';
        stageLabel.classList.add('add-input-button');
        stageRow.appendChild(stageLabel);
    }
}

class InputModal extends Modal {
    constructor(element) {
        super();
        this._element = element;
        this._name = element.name;

        let saveButton = document.createElement('button');
        saveButton.innerHTML = 'Save';
        saveButton.onclick = this.save.bind(this);
        this.contentContainer.appendChild(saveButton);
    }

    save() {
        if (this._onSave) this._onSave();
    }
}

class ButtonModal extends InputModal {
    constructor(element) {
        super(element);
        this._onSave = this.onSave;
        this.createModal();
    }

    createModal() {
        let titleRow = document.createElement('div');
        titleRow.classList.add('flex-row');
        this.content.appendChild(titleRow);

        let title = document.createElement('h2');
        title.innerHTML = 'Edit Button';
        titleRow.appendChild(title);

        let nameRow = document.createElement('div');
        nameRow.classList.add('flex-row');
        this.content.appendChild(nameRow);

        let nameLabel = document.createElement('label');
        nameLabel.classList.add('flex-label');
        nameLabel.innerHTML = 'Name:';
        nameRow.appendChild(nameLabel);

        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = this._name;
        nameInput.classList.add('flex-input');
        nameRow.appendChild(nameInput);
        this._nameInput = nameInput;

        // let shapeRow = document.createElement('div');
        // shapeRow.classList.add('flex-row');
        // this.content.append(shapeRow);

        // let shapeLabel = document.createElement('label');
        // shapeLabel.classList.add('flex-label');
        // shapeLabel.innerHTML = 'Shape:';
        // shapeRow.appendChild(shapeLabel);

        // let shapeInput = document.createElement('input');
        // shapeInput.type = 'radio';
        // // nameInput.value = this._name;
        // shapeInput.classList.add('flex-input');
        // shapeRow.appendChild(shapeInput);
    }

    onSave() {
        this._element.name = this._nameInput.value;
        this._element.setText(this._nameInput.value);
        this.close();
    }

}

class TouchPadModal extends InputModal {
    constructor(element) {
        super(element);
        this._onSave = this.onSave;
        this.createModal();
    }

    createModal() {
        let titleRow = document.createElement('div');
        titleRow.classList.add('flex-row');
        this.content.appendChild(titleRow);

        let title = document.createElement('h2');
        title.innerHTML = 'Edit Touchpad';
        titleRow.appendChild(title);

        let nameRow = document.createElement('div');
        nameRow.classList.add('flex-row');
        this.content.appendChild(nameRow);

        let nameLabel = document.createElement('label');
        nameLabel.classList.add('flex-label');
        nameLabel.innerHTML = 'Name:';
        nameRow.appendChild(nameLabel);

        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = this._name;
        nameInput.classList.add('flex-input');
        nameRow.appendChild(nameInput);
        this._nameInput = nameInput;
    }

    onSave() {
        this._element.name = this._nameInput.value;
        this.close();
    }

}

class SliderModal extends InputModal {
    constructor(element) {
        super(element);
        this._onSave = this.onSave;
        this.createModal();
    }

    createModal() {
        let titleRow = document.createElement('div');
        titleRow.classList.add('flex-row');
        this.content.appendChild(titleRow);

        let title = document.createElement('h2');
        title.innerHTML = 'Edit Slider';
        titleRow.appendChild(title);

        let nameRow = document.createElement('div');
        nameRow.classList.add('flex-row');
        this.content.appendChild(nameRow);

        let nameLabel = document.createElement('label');
        nameLabel.classList.add('flex-label');
        nameLabel.innerHTML = 'Name:';
        nameRow.appendChild(nameLabel);

        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = this._name;
        nameInput.classList.add('flex-input');
        nameRow.appendChild(nameInput);
        this._nameInput = nameInput;
    }

    onSave() {
        this._element.name = this._nameInput.value;
        this.close();
    }
}

class InputElement extends PIXI.Container {
    constructor(params) {
        super();
        this.name = params.name;
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
        this.addChild(this.menu);

        let closeButton = new PIXI.Sprite.from('assets/close.png');
        closeButton.tint = 0xe74c3c;
        closeButton.width = 25;
        closeButton.height = 25;
        closeButton.x = this._width/2;
        closeButton.y = this._height/-2-30;
        closeButton.buttonMode = true;
        closeButton.interactive = true;
        closeButton.on('pointerup', this.close, this);
        this.menu.addChild(closeButton);

        let editButton = new PIXI.Sprite.from('assets/info.png');
        editButton.tint = 0xfafafa;
        editButton.width = 25;
        editButton.height = 25;
        editButton.x = this._width/2-30;
        editButton.y = this._height/-2-30;
        editButton.buttonMode = true;
        editButton.interactive = true;
        editButton.on('pointerup', this.edit, this);
        this.menu.addChild(editButton);
    }

    setEditable(isEditable) {
        if (isEditable) {
            this.menu.visible = true;
            this.editable = true;
        } else {
            this.menu.visible = false;
            this.editable = false;
        }
    }

    setInactive() {
        this.menu.visible = false;
        this.editable = false;
    }

    touchBegin(e) {
        if (!this.draggable) return;
        this._touchStartX = e.data.getLocalPosition(this).x;
        this._touchStartY = e.data.getLocalPosition(this).y;
        // this._longpressTimeout = setTimeout(this.longpressEvent.bind(this), 2000);
    }

    touchEnd() {
        if (this._longpressTimeout) clearTimeout(this._longpressTimeout);
        if (this.editable) return;
        if (this.callback) this.callback();
    }

    onMoveEvent(e) {
        // if (this._longpressTimeout) clearTimeout(this._longpressTimeout);
        // this._longpressTimeout = setTimeout(this.longpressEvent.bind(this), 2000);
    }

    drag(e) {
        this.x = e.data.global.x - this._touchStartX;
        this.y = e.data.global.y - this._touchStartY - 100;
    }

    edit() {
        let modal = new this._modalType(this);
    }

    close() {
        this.destroy();
    }
}

class Button extends InputElement {
    constructor(params) {
        super(params);
        this.shape = params.shape;
        this._modalType = ButtonModal;
        this.create();
    }

    create() {
        this.graphics = new PIXI.Graphics();
        this.overlay = new PIXI.Graphics();
        this.overlay.alpha = 0.2;
        this.overlay.visible = false;

        if (this.shape === 'square') {
            this.graphics.lineStyle(2, 0xFF00FF, 1);
            this.graphics.beginFill(0x650A5A);
            this.graphics.drawRoundedRect(this._width/-2, this._height/-2, this._height, this._width, 16);
            this.graphics.endFill();
            this.overlay.lineStyle(2, 0xFF00FF, 1);
            this.overlay.beginFill(0xFFFFFF);
            this.overlay.drawRoundedRect(this._width/-2, this._height/-2, this._height, this._width, 16);
            this.overlay.endFill();
        } else if (this.shape === 'circle') {
            this.graphics.lineStyle(2, 0xb528a4, 1);
            this.graphics.beginFill(0x650A5A);
            this.graphics.drawCircle(0, 0, this._width/2);
            this.graphics.endFill();
            this.overlay.lineStyle(1, 0xFF00FF, 1);
            this.overlay.beginFill(0xFFFFFF);
            this.overlay.drawCircle(0, 0, this._width/2);
            this.overlay.endFill();
        }
        this.graphics.interactive = true;
        this.addChild(this.graphics);
        this.addChild(this.overlay);

        this.text = new PIXI.Text(this.name, {fontFamily: 'Arial', fontSize: 24, fill: '0xFFFFFF'});
        this.text.anchor.set(0.5);
        this.addChild(this.text);

        this.graphics.on('pointerdown', this.onDown, this);
        this.graphics.on('pointermove', this.onMove, this);
        this.graphics.on('pointerup', this.onUp, this);
    }

    setText(text) {
        this.text.text = text;
        this.text.style.fontSize = 24;
        while (this.text.width > this._width - 10) {
            this.text.style.fontSize -= 1;
        }
    }

    onDown(e) {
        this.touchBegin(e);
        this.isDown = true;
        if (this.editable) return;
        this.overlay.visible = true;
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
        this.overlay.visible = false;
        if (this.editable) return;
        if (this.onchange) this.onchange();
    }

}

class TouchPad extends InputElement {
    constructor(params) {
        super(params);
        this._scaleFactorX = 480 / this._width;
        this._scaleFactorY = 360 / this._height;
        this._modalType = TouchPadModal;
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

        this.pointer = new PIXI.Graphics();
        // this.pointer.lineStyle(2, 0xFF00FF, 1);
        this.pointer.beginFill(0xecf0f1);
        this.pointer.drawCircle(0, 0, 20);
        this.pointer.endFill();
        this.pointer.visible = false;
        this.addChild(this.pointer);
    }

    onDown(e) {
        this.touchBegin(e);
        this.isDown = true;
        if (this.editable) return;
        this.pointer.visible = true;
        this.onMove(e);
    }

    onMove(e) {
        if (!this.isDown) return;
        this.onMoveEvent(e);
        if (this.editable) {
            this.drag(e);
            return;
        }
        let localPos = e.data.getLocalPosition(this);
        this.pointer.x = localPos.x < this._width/-2 ? this._width/-2 : (localPos.x > this._width/2 ? this._width/2 : localPos.x);
        this.pointer.y = localPos.y < this._height/-2 ? this._height/-2 : (localPos.y > this._height/2 ? this._height/2 : localPos.y);
        this._touchX = this.pointer.x * this._scaleFactorX;
        this._touchY = this.pointer.y * this._scaleFactorY;
        this.update();
    }

    onUp() {
        this.touchEnd();
        this.isDown = false;
        this.pointer.visible = false;
    }

    get touchX() {
        return Math.round(this._touchX);
    }

    get touchY() {
        return Math.round(this._touchY);
    }

    update() {
        if (this.onchange) this.onchange([this.touchX, this.touchY]);
    }

}

class ImageButton extends InputElement {
    constructor(params) {
        super(params);
        this._imgSrc = params.imgSrc;
        this.create();
    }

    create() {
        this.button = PIXI.Sprite.from(this._imgSrc);
        this.button.height = this._height;
        this.button.width = this._width;
        this.button.anchor.set(0.5);
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.addChild(this.button);

        this.button.on('pointerdown', this.onDown, this);
        this.button.on('pointermove', this.onMove, this);
        this.button.on('pointerup', this.onUp, this);
    }

    setTint(tint) {
        this.button.tint = tint;
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
        if (this.editable) return;
        if (this.onchange) this.onchange();
    }
}

class Slider extends InputElement {
    constructor(params) {
        super(params);
        this._value = 1;
        this._modalType = SliderModal;
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
        this.fg.height = 40;
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
            resizeTo: window,
            // width: window.innerWidth,
            // height: window.innerHeight,
            autoResize: true,
            // resolution: Math.floor(devicePixelRatio),
            // resolution: 1,
            // forceCanvas: true,
            backgroundColor: 0xa8d3da,
            antialiasing: true
        });
        document.body.appendChild(this.app.view);

        this.stageListeners = [];

        if (window.innerWidth <= 500) {
            this.orientation = 'portrait';
        } else {
            this.orientation = 'landscape';
        }
        console.log(this.orientation);

        this.build();

        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('pointerdown', this.clearActiveElement.bind(this));
        // this.resize();

        this.listeners = [];
    },
    resize () {
        if (window.innerWidth <= 500) {
            this.orientation = 'portrait';
        } else {
            this.orientation = 'landscape';
        }
        this.menuBar.resize();
    },
    build () {
        [this.menuBar, this.connectButton] = this.buildMenuBar();
        this.app.stage.addChild(this.menuBar);

        this.widgetContainer = new PIXI.Container();
        this.widgetContainer.y = 100;
        this.widgetContainer.width = window.innerWidth;
        this.widgetContainer.height = window.innerHeight - 100;
        this.app.stage.addChild(this.widgetContainer);

        let slider = new Slider({
            name: '1',
            width: 60,
            height: 200,
            x: 80,
            y: 100,
            draggable: true
        });
        slider.value = 50;
        slider.onchange = val => this.emit({type: 'sensor', inputType: 'slider', name: slider.name, val: Math.round(val)});
        this.widgetContainer.addChild(slider);

        let touchPad = new TouchPad({
            name: '1',
            width: 200,
            height: 200*.75,
            x: 250,
            y: 200,
            draggable: true
        });
        touchPad.onchange = coords => this.emit({type: 'sensor', inputType: 'touchpad', name: touchPad.name, val: coords});
        this.widgetContainer.addChild(touchPad);

        let button = new Button({
            name: 'go',
            shape: 'circle',
            height: 80,
            width: 80,
            // x: window.innerWidth/2,
            x: 250,
            y: 60,
            draggable: true
            // y: window.innerHeight/2
        });
        button.onchange = () => this.emit({type: 'broadcast', inputType: 'button', name: button.name});
        this.widgetContainer.addChild(button);

        // this.stage = new Stage({
            // width: 200,
            // height: 200*.75,
            // x: 150,
            // y: 150,
            // draggable: true
        // });
        // this.widgetContainer.addChild(this.stage);
    },
    buildMenuBar() {
        menu = new PIXI.Container();

        menuBg = new PIXI.Sprite(PIXI.Texture.WHITE);
        menuBg.width = window.innerWidth;
        menuBg.height = 70;
        menuBg.tint = 0xb590ca;
        menu.addChild(menuBg);

        this.isFullscreen = false;
        let fullscreen  = new ImageButton({
            x: window.innerWidth - 40,
            y: menuBg.height/2,
            width: menuBg.height-30,
            height: menuBg.height-30,
            imgSrc: 'assets/fullscreen.png'
        });
        fullscreen.onchange = e => {
            if (this.isFullscreen) {
                window.document.exitFullscreen();
                this.isFullscreen = false;
            } else {
                if (document.body.requestFullscreen) {
                    this.app.renderer.view.requestFullscreen();
                    this.isFullscreen = true;
                }
            }
        };
        menu.addChild(fullscreen);

        let gf = new ImageButton({
            x: fullscreen.x - 70,
            y: menuBg.height/2,
            width: menuBg.height-20,
            height: menuBg.height-20,
            imgSrc: 'assets/green-flag.png'
        });
        gf.onchange = e => this.emit({type: 'command', name: 'greenflag'});
        menu.addChild(gf);

        let stop = new ImageButton({
            x: gf.x - 70,
            y: menuBg.height/2,
            width: menuBg.height-20,
            height: menuBg.height-20,
            imgSrc: 'assets/stop-all.png'
        });
        stop.onchange = e => this.emit({type: 'command', name: 'stopall'});
        menu.addChild(stop);

        let editTools = new PIXI.Container();
        editTools.x = (this.orientation === 'landscape') ? 200 : 40;
        editTools.y = (this.orientation === 'landscape') ? menuBg.height/2 : window.innerHeight - 40;
        menu.addChild(editTools);

        let editButton = new ImageButton({
            x: 0,
            y: 0,
            width: menuBg.height-20,
            height: menuBg.height-20,
            imgSrc: 'assets/edit.png'
        });
        editButton.onchange = e => {
            setTimeout(() => {
                editButton.visible = false;
                okButton.visible = true;
                addButton.visible = true;
            }, 10);
            this.app.renderer.backgroundColor = 0x88ABB1;
            this.widgetContainer.children.forEach(child => {
                child.setEditable(true);
            });
        };
        editTools.addChild(editButton);

        let okButton = new ImageButton({
            x: 0,
            y: 0,
            width: menuBg.height-20,
            height: menuBg.height-20,
            imgSrc: 'assets/ok.png'
        });
        okButton.setTint(0x2ecc71);
        okButton.visible = false;
        okButton.onchange = e => {
            setTimeout(() => {
                editButton.visible = true;
                okButton.visible = false;
                addButton.visible = false;
            }, 10);
            this.app.renderer.backgroundColor = 0xa8d3da;
            this.widgetContainer.children.forEach(child => {
                child.setEditable(false);
            });
        };
        editTools.addChild(okButton);

        let addButton = new ImageButton({
            x: 70,
            y: 0,
            width: menuBg.height-20,
            height: menuBg.height-20,
            imgSrc: 'assets/add.png'
        });
        addButton.visible = false;
        addButton.onchange = e => {
            let modal = new AddModal(this.createInput.bind(this));
        };
        editTools.addChild(addButton);

        let input = new PIXI.TextInput({
            input: {
                fontSize: '1.6em',
                padding: '12px',
                width: '60px',
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
        input.x = input.width/2 + 10;
        input.y = input.height/2 + 7.5;
        input.pivot.x = input.width/2;
        input.pivot.y = input.height/2;
        menu.addChild(input);

        let connectButton = new ImageButton({
            x: input.width + 40,
            y: menuBg.height/2,
            width: menuBg.height-20,
            height: menuBg.height-20,
            imgSrc: 'assets/connect.png'
        });
        connectButton.setTint(0xf39c12);
        connectButton.onchange = e => this.emit({type: 'command', name: 'connect', value: input.text});
        menu.addChild(connectButton);

        menu.resize = () => {
            menuBg.width = window.innerWidth;
            fullscreen.x = window.innerWidth - 40;
            gf.x = fullscreen.x - 70;
            stop.x = gf.x - 70;
            editTools.x = (this.orientation === 'landscape') ? 200 : 40;
            editTools.y = (this.orientation === 'landscape') ? menuBg.height/2 : window.innerHeight - 40;
        };
        return [menu, connectButton];
    },
    createInput(type) {
        if (!type) return;
        let elem;
        if (type === 'button') {
            let button = new Button({
                name: '',
                shape: 'circle',
                height: 80,
                width: 80,
                // x: window.innerWidth/2,
                x: 50,
                y: 50,
                draggable: true
                // y: window.innerHeight/2
            });
            button.setEditable(true);
            button.edit();
            button.onchange = () => this.emit({type: 'broadcast', inputType: 'button', name: button.name});
            this.widgetContainer.addChild(button);
        } else if (type === 'slider') {
            let slider = new Slider({
                name: '',
                width: 60,
                height: 200,
                x: 50,
                y: 50,
                draggable: true
            });
            slider.value = 50;
            slider.setEditable(true);
            slider.edit();
            slider.onchange = val => this.emit({type: 'sensor', inputType: 'slider', name: slider.name, val: Math.round(val)});
            this.widgetContainer.addChild(slider);
        } else if (type === 'touchpad') {
            let touchPad = new TouchPad({
                name: '',
                width: 200,
                height: 200*.75,
                x: 150,
                y: 150,
                draggable: true
            });
            touchPad.setEditable(true);
            touchPad.edit();
            touchPad.onchange = coords => this.emit({type: 'sensor', inputType: 'touchpad', name: touchPad.name, val: coords});
            this.widgetContainer.addChild(touchPad);
        } else if (type === 'stage') {
            let stage = new Stage({
                width: 200,
                height: 200*.75,
                x: 150,
                y: 150,
                draggable: true
            });
            stage.setEditable(true);
            this.stageListeners.push(stage);
            this.widgetContainer.addChild(stage);
        }
    },
    setConnected(isConnected) {
        if (isConnected) {
            this.connectButton.setTint(0x2ecc71);
        } else {
            this.connectButton.setTint(0xf39c12);
        }
    },
    updateStage(data) {
        PIXI.utils.clearTextureCache();
        PIXI.Loader.shared.reset();
        PIXI.Loader.shared.add('stage', data);
        PIXI.Loader.shared.load((loader, resources) => {
            this.stageListeners.forEach(stage => {
                stage.updateTexture(resources.stage.texture);
            });
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
