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

        let closeButton = document.createElement('div');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = 'x';
        closeButton.addEventListener('pointerup', this.close.bind(this));
        contentContainer.appendChild(closeButton);

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

class ConnectModal extends Modal {
    constructor(callback) {
        super();
        this._callback = callback;
        this._pin = [];
        this.createModal();
    }

    createModal() {
        this.content.setAttribute('tabindex', '0');
        this.content.addEventListener('keydown', this.keypress.bind(this));
        this.content.focus();

        let titleRow = document.createElement('div');
        titleRow.classList.add('flex-row', 'pin-display');
        this.content.appendChild(titleRow);

        this.display = document.createElement('div');
        this.display.classList.add('empty');
        this.display.innerHTML = '0000';
        titleRow.appendChild(this.display);

        this.content.appendChild(this.createRow([1, 2, 3]));
        this.content.appendChild(this.createRow([4, 5, 6]));
        this.content.appendChild(this.createRow([7, 8, 9]));
        this.content.appendChild(this.createRow(['<', 0, 'ok']));

        // buttonRow1.appendChild(button1);
    }

    createRow(btns) {
        let row = document.createElement('div');
        row.classList.add('flex-row');
        btns.forEach(b => {
            row.appendChild(this.createButton(b));
        });
        return row;
    }

    createButton(val) {
        let button = document.createElement('div');
        button.classList.add('pin-button');
        button.innerHTML = val;
        button.addEventListener('pointerup', e => {
            this.evalInput(val);
        });
        return button;
    }

    evalInput(val) {
        if ('0123456789'.indexOf(val) >= 0) {
            this.typeNum(val);
        } else if (val === '<' || val === 'Backspace') {
            this.delete();
        } else if (val === 'ok' || val === 'Enter') {
            this.submit();
        }
    }

    keypress(e) {
        this.evalInput(e.key);
    }

    typeNum(val) {
        if (this._pin.length === 0) this.display.classList.remove('empty');
        if (this._pin.length < 4) this._pin.push(val);
        this.updateDisplay();
    }

    delete() {
        if (this._pin.length === 0) return;
        this._pin.pop();
        if (this._pin.length === 0) {
            this.display.innerHTML = '0000';
            this.display.classList.add('empty');
            return;
        }
        this.updateDisplay();
    }

    submit() {
        if (this._pin.length !== 4) return;
        this._callback(this._pin.join(''));
        this.close();
    }

    updateDisplay() {
        this.display.innerHTML = this._pin.join('');
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

        let colorRow = document.createElement('div');
        colorRow.classList.add('flex-row');
        this.content.appendChild(colorRow);

        let colorLabel = document.createElement('label');
        colorLabel.classList.add('flex-label');
        colorLabel.innerHTML = 'Color:';
        colorRow.appendChild(colorLabel);

        let colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#' + this._element.color.toString(16);
        colorInput.classList.add('flex-input');
        colorRow.appendChild(colorInput);
        this._colorInput = colorInput;

        let typeRow = document.createElement('div');
        typeRow.classList.add('flex-row');
        this.content.append(typeRow);

        let typeLabel = document.createElement('label');
        typeLabel.classList.add('flex-label');
        typeLabel.innerHTML = 'Type:';
        typeRow.appendChild(typeLabel);

        let div = document.createElement('div');
        div.classList.add('flex-input', 'flex-input-radio');
        typeRow.appendChild(div);

        let item1 = document.createElement('div');
        div.appendChild(item1);

        let typeButtonInput = document.createElement('input');
        typeButtonInput.type = 'radio';
        typeButtonInput.value = 'button';
        typeButtonInput.name = 'button-type';
        // nameInput.value = this._name;
        // typeButtonInput.classList.add('flex-input');
        // typeRow.appendChild(typeButtonInput);
        item1.appendChild(typeButtonInput);

        let typeButtonLabel = document.createElement('label');
        typeButtonLabel.innerHTML = 'button';
        item1.appendChild(typeButtonLabel);

        let item2 = document.createElement('div');
        div.appendChild(item2);

        let typeBroadcastInput = document.createElement('input');
        typeBroadcastInput.type = 'radio';
        typeBroadcastInput.value = 'broadcast';
        typeBroadcastInput.name = 'button-type';
        // nameInput.value = this._name;
        // typeBroadcastInput.classList.add('flex-input');
        // typeRow.appendChild(typeBroadcastInput);
        item2.appendChild(typeBroadcastInput);

        let typeBroadcastLabel = document.createElement('label');
        typeBroadcastLabel.innerHTML = 'broadcast';
        item2.appendChild(typeBroadcastLabel);

        if (this._element.buttonType === 'button') typeButtonInput.checked = true;
        else typeBroadcastInput.checked = true;

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
        this._element.color = this._colorInput.value.substring(1);
        this._element.bg.tint = parseInt(this._element.color, 16);
        this._element.buttonType =
            Array.prototype.find.call(document.getElementsByName('button-type'), radio => radio.checked).value;
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

        let rangeRow = document.createElement('div');
        rangeRow.classList.add('flex-row');
        this.content.appendChild(rangeRow);

        let rangeLabel = document.createElement('label');
        rangeLabel.classList.add('flex-label');
        rangeLabel.innerHTML = 'Range:';
        rangeRow.appendChild(rangeLabel);

        let minInput = document.createElement('input');
        minInput.type = 'text';
        minInput.value = this._element.min;
        minInput.classList.add('flex-input', 'range-input');
        rangeRow.appendChild(minInput);
        this._minInput = minInput;

        let toLabel = document.createElement('label');
        toLabel.innerHTML = '-';
        rangeRow.appendChild(toLabel);

        let maxInput = document.createElement('input');
        maxInput.type = 'text';
        maxInput.value = this._element.max;
        maxInput.classList.add('flex-input', 'range-input');
        rangeRow.appendChild(maxInput);
        this._maxInput = maxInput;
    }

    onSave() {
        this._element.name = this._nameInput.value;
        this._element.min = parseInt(this._minInput.value);
        this._element.max = parseInt(this._maxInput.value);
        this.close();
    }
}

class KnobModal extends InputModal {
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
        title.innerHTML = 'Edit Knob';
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

class MotionModal extends InputModal {
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
        title.innerHTML = 'Edit Motion';
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

        let flipXRow = document.createElement('div');
        flipXRow.classList.add('flex-row');
        this.content.appendChild(flipXRow);

        let flipXLabel = document.createElement('label');
        flipXLabel.classList.add('flex-label');
        flipXLabel.innerHTML = 'Flip X:';
        flipXRow.appendChild(flipXLabel);

        let flipXInput = document.createElement('input');
        flipXInput.type = 'checkbox';
        flipXInput.checked = this._element.flipX;
        flipXInput.classList.add('flex-input');
        flipXRow.appendChild(flipXInput);
        this._flipXInput = flipXInput;

        let flipYRow = document.createElement('div');
        flipYRow.classList.add('flex-row');
        this.content.appendChild(flipYRow);

        let flipYLabel = document.createElement('label');
        flipYLabel.classList.add('flex-label');
        flipYLabel.innerHTML = 'Flip Y:';
        flipYRow.appendChild(flipYLabel);

        let flipYInput = document.createElement('input');
        flipYInput.type = 'checkbox';
        flipYInput.checked = this._element.flipY;
        flipYInput.classList.add('flex-input');
        flipYRow.appendChild(flipYInput);
        this._flipYInput = flipYInput;
    }

    onSave() {
        this._element.name = this._nameInput.value;
        this._element.flipX = this._flipXInput.checked;
        this._element.flipY = this._flipYInput.checked;
        this.close();
    }
}

class InputElement extends PIXI.Container {
    constructor(params) {
        super();
        this.name = params.name;
        this._width = params.width;
        this._height = params.height;
        this._scale = 1;
        this.x = params.x;
        this.y = params.y;
        this.params = params;
        this.editable = false;
        this.draggable = (this.params.draggable) ? true : false;
        this.mainContainer = new PIXI.Container();
        this.addChild(this.mainContainer);
        this.createMenu();
    }

    createMenu() {
        this.menu = new PIXI.Container();
        this.menu.visible = false;
        this.addChild(this.menu);

        this.closeButton = new PIXI.Sprite.from('assets/close.png');
        this.closeButton.tint = 0xe74c3c;
        this.closeButton.width = 25;
        this.closeButton.height = 25;
        this.closeButton.x = this._width/2;
        this.closeButton.y = this._height/-2-30;
        this.closeButton.buttonMode = true;
        this.closeButton.interactive = true;
        this.closeButton.on('pointerup', this.close, this);
        this.menu.addChild(this.closeButton);

        this.editButton = new PIXI.Sprite.from('assets/info.png');
        this.editButton.tint = 0xfafafa;
        this.editButton.width = 25;
        this.editButton.height = 25;
        this.editButton.x = this._width/2-30;
        this.editButton.y = this._height/-2-30;
        this.editButton.buttonMode = true;
        this.editButton.interactive = true;
        this.editButton.on('pointerup', this.edit, this);
        this.menu.addChild(this.editButton);

        this.boundingBox = new PIXI.Graphics();
        this.boundingBox.lineStyle(2, 0x3b3b3b, 1);
        this.boundingBox.drawRoundedRect(
            this._width/-2, this._height/-2,
            this._width, this._height, 2);
        this.boundingBox.endFill();
        this.menu.addChild(this.boundingBox);

        this.rotateButton = new PIXI.Sprite.from('assets/rotate.png');
        this.rotateButton.tint = 0xfafafa;
        this.rotateButton.width = 25;
        this.rotateButton.height = 25;
        this.rotateButton.x = this._width/-2-25;
        this.rotateButton.y = this._height/2;
        this.rotateButton.buttonMode = true;
        this.rotateButton.interactive = true;
        this.rotateButton.on('pointerdown', this.rotate, this);
        this.rotateButton.on('pointerup', this.touchEnd, this);
        this.rotateButton.on('pointerupoutside', this.touchEnd, this);
        this.rotateButton.on('pointermove', this.onRotate, this);
        this.menu.addChild(this.rotateButton);

        this.resizeButton = new PIXI.Sprite.from('assets/scale.png');
        this.resizeButton.tint = 0xfafafa;
        this.resizeButton.width = 25;
        this.resizeButton.height = 25;
        this.resizeButton.x = this._width/2;
        this.resizeButton.y = this._height/2;
        this.resizeButton.buttonMode = true;
        this.resizeButton.interactive = true;
        this.resizeButton.on('pointerdown', this.resize, this);
        this.resizeButton.on('pointerup', this.touchEnd, this);
        this.resizeButton.on('pointerupoutside', this.touchEnd, this);
        this.resizeButton.on('pointermove', this.onResize, this);
        this.menu.addChild(this.resizeButton);
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
        if (this.editable) this.zIndex = 100;
        this._touchStartX = e.data.getLocalPosition(this).x;
        this._touchStartY = e.data.getLocalPosition(this).y;
        // this._longpressTimeout = setTimeout(this.longpressEvent.bind(this), 2000);
    }

    rotate(e) {
        // this.touchBegin(e);
        const pos = e.data.getLocalPosition(this);
        this._touchStartAngle = Math.atan2(pos.y, pos.x) * (180/Math.PI);
        this.rotating = true;
    }

    resize(e) {
        const pos = e.data.getLocalPosition(this);
        this._touchStartDist = Math.sqrt(Math.pow(pos.x,2) + Math.pow(pos.y,2));
        this.resizing = true;
    }

    onResize(e) {
        if (!this.resizing) return;
        this.closeButton.x = this.mainContainer.width/2;
        this.closeButton.y = this.mainContainer.height/-2-30;
        this.editButton.x = this.mainContainer.width/2-30;
        this.editButton.y = this.mainContainer.height/-2-30;
        this.rotateButton.x = this.mainContainer.width/-2-25;
        this.rotateButton.y = this.mainContainer.height/2;
        this.resizeButton.x = this.mainContainer.width/2;
        this.resizeButton.y = this.mainContainer.height/2;
        this.boundingBox.clear();
        this.boundingBox.lineStyle(2, 0x3b3b3b, 1);
        this.boundingBox.drawRoundedRect(
            this.mainContainer.width/-2, this.mainContainer.height/-2,
            this.mainContainer.width, this.mainContainer.height, 2);
        this.boundingBox.endFill();
    }

    touchEnd() {
        this.rotating = false;
        this.resizing = false;
        this.zIndex = 0;
        if (this._longpressTimeout) clearTimeout(this._longpressTimeout);
        if (this.editable) return;
        if (this.callback) this.callback();
    }

    onRotate(e) {
        if (!this.rotating) return;
        const x = e.data.global.x - this.x;
        const y = e.data.global.y - this.y - 100;
        let rads = Math.atan2(y, x) * (180/Math.PI);
        this.angle = rads - this._touchStartAngle;
    }

    onMoveEvent(e) {
        // console.log(e);
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
        if (this instanceof Stage) {
            UI.checkStageListeners();
        }
    }
}

class Button extends InputElement {
    constructor(params) {
        super(params);
        this.shape = params.shape;
        this.color = params.color;
        this.buttonType = params.type;
        this._modalType = ButtonModal;
        this.create();
    }

    create() {
        // this.graphics = new PIXI.Graphics();
        // this.overlay = new PIXI.Graphics();
        // this.overlay.alpha = 0.2;
        // this.overlay.visible = false;

        // if (this.shape === 'square') {
            // this.graphics.lineStyle(2, 0xFF00FF, 1);
            // this.graphics.beginFill(0x650A5A);
            // this.graphics.drawRoundedRect(this._width/-2, this._height/-2, this._height, this._width, 16);
            // this.graphics.endFill();
            // this.overlay.lineStyle(2, 0xFF00FF, 1);
            // this.overlay.beginFill(0xFFFFFF);
            // this.overlay.drawRoundedRect(this._width/-2, this._height/-2, this._height, this._width, 16);
            // this.overlay.endFill();
        // } else if (this.shape === 'circle') {
            // this.graphics.lineStyle(2, 0xb528a4, 1);
            // this.graphics.beginFill(0x650A5A);
            // this.graphics.drawCircle(0, 0, this._width/2);
            // this.graphics.endFill();
            // this.overlay.lineStyle(1, 0xFF00FF, 1);
            // this.overlay.beginFill(0xFFFFFF);
            // this.overlay.drawCircle(0, 0, this._width/2);
            // this.overlay.endFill();
        // }
        // this.graphics.interactive = true;

        this.bg = new PIXI.Sprite.from('assets/button-round.png');
        this.bg.width = this._width;
        this.bg.height = this._height;
        this.bg.anchor.set(0.5);
        this.bg.tint = this.color;
        this.bg.interactive = true;
        this.mainContainer.addChild(this.bg);

        this.overlay = new PIXI.Sprite.from('assets/button-round.png');
        this.overlay.width = this._width;
        this.overlay.height = this._height;
        this.overlay.anchor.set(0.5);
        this.overlay.alpha = 0.5;
        this.overlay.visible = false;
        this.mainContainer.addChild(this.overlay);

        this.text = new PIXI.Text(this.name, {fontFamily: 'Arial', fontSize: 24, fill: '0xFFFFFF'});
        this.text.anchor.set(0.5);
        this.mainContainer.addChild(this.text);

        this.bg.on('pointerdown', this.onDown, this);
        this.bg.on('pointermove', this.onMove, this);
        this.bg.on('pointerover', this.onHover, this);
        this.bg.on('pointerout', this.onOut, this);
        this.bg.on('pointerup', this.onUp, this);
        this.bg.on('pointerupoutside', this.onUp, this);
        // this.bg.on('touchmove', () => console.log('touch'));
        // this.bg.on('touchend', () => console.log('touchend'));
    }

    setText(text) {
        this.text.text = text;
        this.text.style.fontSize = 24 * this._scale;
        while (this.text.width > this._width - 10) {
            this.text.style.fontSize -= 1;
        }
    }

    onDown(e) {
        this.touchBegin(e);
        this.isDown = true;
        if (this.editable) return;
        this.status = true;
        if (this.buttonType === 'button' && this.onchange) this.onchange();
        this.overlay.visible = true;
    }

    onHover(e) {
        if (!this.editable && e.data.buttons === 1 && !this.isDown) {
            this.onDown(e);
        }
    }

    onOut(e) {
        if (this.editable) return;
        if (!this.isDown) return;
        this.onUp(e);
    }

    onMove(e) {
        if (this.isDown && this.editable) {
            this.drag(e);
            return;
        } else if (!this.editable && e.data.buttons === 1 && !this.isDown && this.bg.containsPoint(e.data.global)) {
            this.onDown(e);
        } else if (this.isDown && !this.bg.containsPoint(e.data.global)) {
            this.onUp(e);
        }
    }

    onResize(e) {
        if (!this.resizing) return;
        const x = e.data.global.x - this.x;
        const y = e.data.global.y - this.y - 100;
        let dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        const distDelta = dist - this._touchStartDist;
        this._touchStartDist = dist;
        const scale = 1 + (distDelta / this._touchStartDist);
        this.bg.width *= scale;
        this.bg.height *= scale;
        this.overlay.width *= scale;
        this.overlay.height *= scale;
        this.text.style.fontSize *= scale;
        this._scale += (scale - 1);
        this._width = this.bg.width;
        this._height = this.bg.height;
        InputElement.prototype.onResize.call(this, e);
    }

    onUp(event) {
        this.touchEnd();
        this.isDown = false;
        this.overlay.visible = false;
        if (this.editable) return;
        this.status = false;
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
        this.mainContainer.addChild(this.bg);

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
        this.mainContainer.addChild(this.pointer);
    }

    onResize(e) {
        if (!this.resizing) return;
        const x = e.data.global.x - this.x;
        const y = e.data.global.y - this.y - 100;
        let dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        const distDelta = dist - this._touchStartDist;
        this._touchStartDist = dist;
        const scale = 1 + (distDelta / this._touchStartDist);
        this.bg.width *= scale;
        this.bg.height *= scale;
        this._width = this.mainContainer.width;
        this._height = this.mainContainer.height;
        InputElement.prototype.onResize.call(this, e);
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
        this._scaleFactorX = 480 / this._width;
        this._scaleFactorY = 360 / this._height;
        this._touchX = this.pointer.x * this._scaleFactorX;
        this._touchY = this.pointer.y * this._scaleFactorY;
        this.update();
    }

    onUp() {
        this.touchEnd();
        this.isDown = false;
        this.pointer.visible = false;
        if (this.editable) return;
        if (this.onchange) this.onchange([this.touchX, this.touchY, this.isDown]);
    }

    get touchX() {
        return Math.round(this._touchX);
    }

    get touchY() {
        return Math.round(this._touchY);
    }

    update() {
        if (this.onchange) this.onchange([this.touchX, this.touchY, this.isDown]);
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

    setTexture(texture) {
        this.button.texture = texture;
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
        this.min = params.min || 0;
        this.max = params.max || 100;
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
        this.mainContainer.addChild(this.bg);

        this.bg.on('pointerdown', this.onDown, this);
        this.bg.on('pointermove', this.onMove, this);
        this.bg.on('pointerup', this.onUp, this);
        this.bg.on('pointerupoutside', this.onUp, this);

        this.fg = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.fg.anchor.set(0.5);
        this.fg.width = this.bg.width;
        this.fg.height = 40;
        this.mainContainer.addChild(this.fg);

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
        const scale = this.mainContainer.scale.x;
        const y = e.data.getLocalPosition(this).y;
        this.value = 100 - ((y + (this.bg.height*scale)/2) / (this.bg.height*scale) * 100);
    }

    onUp() {
        this.touchEnd();
        this.isDown = false;
    }

    onResize(e) {
        if (!this.resizing) return;
        const x = e.data.global.x - this.x;
        const y = e.data.global.y - this.y - 100;
        let dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        const distDelta = dist - this._touchStartDist;
        this._touchStartDist = dist;
        const scale = 1 + (distDelta / this._touchStartDist);
        this.bg.width *= scale;
        this.bg.height *= scale;
        this.fg.width *= scale;
        this.fg.height *= scale;
        this._width = this.mainContainer.width;
        this._height = this.mainContainer.height;
        InputElement.prototype.onResize.call(this, e);
    }

    update() {
        this.fg.y = this.bg.height/2 - (this.value * this.bg.height / 100);
        if (this.onchange) this.onchange(this.scaledValue);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        val = Math.round(Math.min(Math.max(val, 0), 100));
        if (val === this._value) return;
        this._value = val;
        this.update();
    }

    get scaledValue() {
        // let min = -240;
        // let max = 240;
        let scale = (this.max - this.min) / 100;
        console.log((this.value * scale) + this.min);
        return (this.value * scale) + this.min;
    }
}

class Knob extends InputElement {
    constructor(params) {
        super(params);
        this._value = 1;
        this._freespin = (params.freespin) ? true : false;
        this._modalType = KnobModal;
        this.create();
    }

    create() {
        this.slot = new PIXI.Sprite.from('assets/button-round.png');
        this.slot.anchor.set(0.5);
        this.slot.tint = 0x121212;
        this.slot.width = this._width;
        this.slot.height = this._height;
        this.mainContainer.addChild(this.slot);

        this.marker = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.marker.anchor.set(0.5);
        this.marker.width = 4;
        this.marker.height = this._height/2;
        this.marker.y = this._height/-4;
        this.mainContainer.addChild(this.marker);

        this.bg = new PIXI.Sprite.from('assets/button-round.png');
        this.bg.anchor.set(0.5);
        this.bg.tint = 0x404040;
        this.bg.width = this._width * 0.85;
        this.bg.height = this._height * 0.85;
        this.bg.interactive = true;
        this.bg.buttonMode = true;
        this.mainContainer.addChild(this.bg);

        this.bg.on('pointerdown', this.onDown, this);
        this.bg.on('pointermove', this.onMove, this);
        this.bg.on('pointerup', this.onUp, this);
        this.bg.on('pointerupoutside', this.onUp, this);

        this.fg = new PIXI.Sprite.from('assets/button-round.png');
        this.fg.anchor.set(0.5);
        this.fg.width = 25;
        this.fg.height = 25;
        this.mainContainer.addChild(this.fg);

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
        const scale = this.mainContainer.scale.x;
        const pos = e.data.getLocalPosition(this);
        let rads = Math.atan2(pos.y, pos.x) + 1.5708;
        let time = new Date().getTime();
        let angularRotation = (rads-this._lastRad) / (time - this._lastRotate) * this.bg.width;
        if (angularRotation !== Infinity && angularRotation !== -Infinity) {
            this._angularRotation = angularRotation * 2;
        }
        this._lastRad = rads;
        this._lastRotate = time;
        let angle = rads / Math.PI*180;
        if (angle < 0) angle = 360 + angle;
        this.value = angle;
    }

    onUp() {
        this.touchEnd();
        this.isDown = false;
        if (this._freespin && this._angularRotation) {
            this._spinSpeed = Math.abs(this._angularRotation / 20);
            this._spinDirection = (this._angularRotation < 0) ? -1 : 1;
            this.spin();
        }
    }

    spin() {
        // this.rotation += this._spinSpeed;
        this.value = this.value + (this._spinSpeed / Math.PI * 180 * this._spinDirection);
        this._angularRotation -= this._spinSpeed * this._spinDirection;
        // this._spinSpeed *= .5;
        this._spinSpeed -= this._spinSpeed / 20;
        if (this._spinSpeed < 0.01) this._angularRotation = 0;
        if (this._angularRotation * this._spinDirection > 0) {
            requestAnimationFrame(this.spin.bind(this));
        }
    }

    onResize(e) {
        if (!this.resizing) return;
        const x = e.data.global.x - this.x;
        const y = e.data.global.y - this.y - 100;
        let dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        const distDelta = dist - this._touchStartDist;
        this._touchStartDist = dist;
        const scale = 1 + (distDelta / this._touchStartDist);
        this.bg.width *= scale;
        this.bg.height *= scale;
        this.fg.width *= scale;
        this.fg.height *= scale;
        this.fg.x *= scale;
        this.fg.y *= scale;
        this.slot.width *= scale;
        this.slot.height *= scale;
        this.marker.width *= scale;
        this.marker.height *= scale;
        this.marker.y *= scale;
        this._width = this.mainContainer.width;
        this._height = this.mainContainer.height;
        InputElement.prototype.onResize.call(this, e);
    }

    update() {
        // this.fg.y = this.bg.height/2 - (this.value * this.bg.height / 100);
        this.fg.x = (this.bg.height/2 - this.fg.width/1.3) * Math.sin(this.value * Math.PI / 180);
        this.fg.y = -(this.bg.height/2 - this.fg.width/1.3) * Math.cos(this.value * Math.PI / 180);
        if (this.onchange) this.onchange(this.value);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        // val = Math.min(Math.max(val, 0), 100);
        val = Math.round(val);
        if (this.value === val) return;
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
        this.mainContainer.addChild(this.stage);

        this.stage.on('pointerdown', this.onDown, this);
        this.stage.on('pointermove', this.onMove, this);
        this.stage.on('pointerup', this.onUp, this);
        this.stage.on('pointerupoutside', this.onUp, this);
    }

    onResize(e) {
        if (!this.resizing) return;
        const x = e.data.global.x - this.x;
        const y = e.data.global.y - this.y - 100;
        let dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        const distDelta = dist - this._touchStartDist;
        this._touchStartDist = dist;
        const scale = 1 + (distDelta / this._touchStartDist);
        this.stage.width *= scale;
        this.stage.height *= scale;
        this._scale += (scale - 1);
        this._width = this.stage.width;
        this._height = this.stage.height;
        InputElement.prototype.onResize.call(this, e);
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

class Motion extends InputElement {
    constructor(params) {
        super(params);
        this._width = 50;
        this._height = 50;
        this.visible = params.visible;
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._mag = 0;
        this.flipX = false;
        this.flipY = false;
        this.create();
    }

    create() {
        let bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF);
        bg.drawRoundedRect(this._width/-2, this._height/-2, this._height, this._width, 6);
        bg.beginFill(0xe67e22);
        bg.drawRect(-1, this._height/-2, 2, this._height);
        bg.beginFill(0x9b59b6);
        bg.drawRect(this._width/-2, -1, this._width, 2);
        bg.endFill();
        bg.interactive = true;
        bg.on('pointerup', e => {
            if (!UI.deviceHasMotion) {
                console.log('has motion');
                DeviceOrientationEvent.requestPermission()
                .then(state => {
                    console.log(state);
                    if (state === 'granted') {
                        window.addEventListener('devicemotion', (e) => {
                            UI.updateMotion(
                                e.accelerationIncludingGravity.x,
                                e.accelerationIncludingGravity.y,
                                e.accelerationIncludingGravity.z
                            );
                        });
                    }
                });
            } else {
                let modal = new MotionModal(this);
            }
        });
        this.addChild(bg);

        this.fg = new PIXI.Graphics();
        this.fg.beginFill(0x0000000);
        this.fg.drawCircle(0, 0, 4);
        this.fg.endFill();
        this.fg.alpha = 0.7;
        this.addChild(this.fg);

        let textXLabel = new PIXI.Text('X', {fontFamily: 'Arial', fontSize: 12, fill: '0x8e44ad'});
        textXLabel.anchor.set(0.5);
        textXLabel.x = -34;
        textXLabel.y = -5;
        this.addChild(textXLabel);

        this.textX = new PIXI.Text('0', {fontFamily: 'Arial', fontSize: 12, fill: '0x8e44ad'});
        this.textX.anchor.set(0.5);
        this.textX.x = -34;
        this.textX.y = 5;
        this.addChild(this.textX);

        let textYLabel = new PIXI.Text('Y', {fontFamily: 'Arial', fontSize: 12, fill: '0xd35400'});
        textYLabel.anchor.set(0.5);
        textYLabel.x = -7;
        textYLabel.y = -32;
        this.addChild(textYLabel);

        this.textY = new PIXI.Text('0', {fontFamily: 'Arial', fontSize: 12, fill: '0xd35400'});
        this.textY.anchor.set(0.5);
        this.textY.x = 7;
        this.textY.y = -32;
        this.addChild(this.textY);

        let textZLabel = new PIXI.Text('Z', {fontFamily: 'Arial', fontSize: 12, fill: '0x000000'});
        textZLabel.anchor.set(0.5);
        textZLabel.x = 32;
        textZLabel.y = 20;
        this.addChild(textZLabel);

        this.textZ = new PIXI.Text('0', {fontFamily: 'Arial', fontSize: 12, fill: '0x000000'});
        this.textZ.anchor.set(0.5);
        this.textZ.x = 28;
        this.textZ.y = 32;
        this.addChild(this.textZ);
    }

    setValue(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
        let mag = Math.cbrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
        this._magD = Math.round(Math.abs(mag - this._mag) * 100);
        this._mag = mag;
        this.update();
    }

    get motionX() {
        const x = (this.flipX) ? -this._x : this._x;
        return Math.round(x*-10);
    }

    get motionY() {
        const y = (this.flipY) ? -this._y : this._y;
        return Math.round(y*10);
    }

    get motionZ() {
        return Math.round(this._z*10);
    }

    getVals() {
        return [this.motionX, this.motionY, this.motionZ, this._magD];
    }

    update() {
        this.textX.text = this.motionX;
        this.textY.text = this.motionY;
        this.textZ.text = this.motionZ;
        this.fg.clear();
        this.fg.x = (this.flipX) ? this._x * 2 : this._x * -2;
        this.fg.y = (this.flipY) ? this._y * -2 : this._y * 2;
        this.fg.beginFill(0x0000000);
        this.fg.drawCircle(0, 0, 2+(Math.abs(this._z)/3));
        this.fg.endFill();
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
            backgroundColor: 0xE5EFFF,
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
        this.motionMonitor.x = window.innerWidth - 42;
        this.menuBar.resize();
    },
    build () {
        [this.menuBar, this.connectButton] = this.buildMenuBar();
        this.app.stage.addChild(this.menuBar);

        this.widgetContainer = new PIXI.Container();
        this.widgetContainer.y = 100;
        this.widgetContainer.width = window.innerWidth;
        this.widgetContainer.height = window.innerHeight - 100;
        this.widgetContainer.sortableChildren = true;
        this.app.stage.addChild(this.widgetContainer);

        this.motionMonitor = new Motion({
            name: 'test',
            x: window.innerWidth - 42,
            y: 10,
            draggable: false,
            visible: false
        });
        this.widgetContainer.addChild(this.motionMonitor);

        let slider = new Slider({
            name: 'size',
            width: 60,
            height: 200,
            x: 80,
            y: 100,
            draggable: true
        });
        slider.value = 50;
        slider.onchange = val => this.emit({type: 'sensor', inputType: 'slider', name: slider.name, val: Math.round(val)});
        this.widgetContainer.addChild(slider);

        let knob = new Knob({
            name: 'direction',
            width: 120,
            height: 120,
            x: 80,
            y: 280,
            draggable: true
        });
        knob.value = 0;
        knob.onchange = val => this.emit({type: 'sensor', inputType: 'knob', name: knob.name, val: Math.round(val)});
        this.widgetContainer.addChild(knob);

        let touchPad = new TouchPad({
            name: 'finger',
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
            color: 0x650A5A,
            type: 'button',
            height: 80,
            width: 80,
            // x: window.innerWidth/2,
            x: 250,
            y: 60,
            draggable: true
            // y: window.innerHeight/2
        });
        button.onchange = () => this.emit({type: 'sensor', inputType: button.buttonType, name: button.name, val: button.status});
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
        menuBg.tint = 0x4D97FF;
        menu.addChild(menuBg);

        fullscreenTexture = new PIXI.Texture.from('assets/fullscreen.png');
        unfullscreenTexture = new PIXI.Texture.from('assets/unfullscreen.png');
        this.isFullscreen = false;
        let fullscreen  = new ImageButton({
            x: window.innerWidth - 30,
            y: menuBg.height/2,
            width: menuBg.height-40,
            height: menuBg.height-40,
            imgSrc: fullscreenTexture
        });
        fullscreen.onchange = e => {
            if (this.isFullscreen) {
                fullscreen.setTexture(fullscreenTexture);
                window.document.exitFullscreen();
                this.isFullscreen = false;
            } else {
                if (document.body.requestFullscreen) {
                    fullscreen.setTexture(unfullscreenTexture);
                    this.app.renderer.view.requestFullscreen();
                    this.isFullscreen = true;
                }
            }
        };
        menu.addChild(fullscreen);

        let gf = new ImageButton({
            x: fullscreen.x - 60,
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
        editTools.x = 100;
        editTools.y = menuBg.height/2;
        // editTools.x = (this.orientation === 'landscape') ? 180 : 40;
        // editTools.y = (this.orientation === 'landscape') ? menuBg.height/2 : window.innerHeight - 40;
        menu.addChild(editTools);

        let editButton = new ImageButton({
            x: 0,
            y: 0,
            width: menuBg.height-30,
            height: menuBg.height-30,
            imgSrc: 'assets/edit.png'
        });
        editButton.onchange = e => {
            setTimeout(() => {
                editButton.visible = false;
                okButton.visible = true;
                addButton.visible = true;
            }, 10);
            this.app.renderer.backgroundColor = 0xb3bac6;
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
            this.app.renderer.backgroundColor = 0xE5EFFF;
            this.widgetContainer.children.forEach(child => {
                child.setEditable(false);
            });
        };
        editTools.addChild(okButton);

        let addButton = new ImageButton({
            x: 60,
            y: 0,
            width: menuBg.height-20,
            height: menuBg.height-20,
            imgSrc: 'assets/add.png'
        });
        addButton.visible = false;
        addButton.onchange = e => {
            let modal = new AddModal(type => {
                if (type === 'stage') {
                    this.emit({type: 'stage-subscription', state: true});
                }
                this.createInput(type);
            });
        };
        editTools.addChild(addButton);

        // this.rtcInput = new PIXI.TextInput({
            // input: {
                // fontSize: '1.6em',
                // padding: '12px',
                // width: '60px',
                // color: '#26272E'
            // },
            // box: {
                // default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
                // focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
                // disabled: {fill: 0xDBDBDB, rounded: 12}
            // }
        // });
        // this.rtcInput.placeholder = '0000';
        // this.rtcInput.maxLength = 4;
        // this.rtcInput.restrict = '0123456789';
        // this.rtcInput.x = this.rtcInput.width/2 + 10;
        // this.rtcInput.y = this.rtcInput.height/2 + 7.5;
        // this.rtcInput.pivot.x = this.rtcInput.width/2;
        // this.rtcInput.pivot.y = this.rtcInput.height/2;
        // menu.addChild(this.rtcInput);

        this.statusReadyTexture = new PIXI.Texture.from('assets/status-ready.png');
        this.statusSearchingTexture = new PIXI.Texture.from('assets/searching.png');
        this.statusNotReadyTexture = new PIXI.Texture.from('assets/status-not-ready.png');
        connectButton = new ImageButton({
            x: 40,
            y: menuBg.height/2,
            width: menuBg.height-30,
            height: menuBg.height-30,
            imgSrc: 'assets/status-not-ready.png'
        });
        connectButton.onchange = e => {
            let modal = new ConnectModal(pin => {
                this.emit({type: 'command', name: 'connect', value: pin});
                connectButton.setTexture(this.statusSearchingTexture);
                connectButton.animationTimeout = setTimeout(() => {
                    connectButton.animating = false;
                    connectButton.rotation = 0;
                    connectButton.setTexture(this.statusNotReadyTexture);
                }, 5000);
                connectButton.animation = () => {
                    if (!this.isConnected && connectButton.animating) {
                        connectButton.rotation += 0.05;
                        requestAnimationFrame(connectButton.animation);
                    }
                };
                connectButton.animating = true;
                connectButton.animation();
            });
        };
        menu.addChild(connectButton);

        menu.resize = () => {
            menuBg.width = window.innerWidth;
            fullscreen.x = window.innerWidth - 30;
            gf.x = fullscreen.x - 60;
            stop.x = gf.x - 70;
            // editTools.x = (this.orientation === 'landscape') ? 200 : 40;
            // editTools.y = (this.orientation === 'landscape') ? menuBg.height/2 : window.innerHeight - 40;
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
                type: 'button',
                height: 80,
                width: 80,
                color: 0x8e44ad,
                // x: window.innerWidth/2,
                x: 50,
                y: 50,
                draggable: true
                // y: window.innerHeight/2
            });
            button.setEditable(true);
            button.edit();
            button.onchange = () => this.emit({type: 'sensor', inputType: button.buttonType, name: button.name, val: button.status});
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
            this.isConnected = true;
            this.connectButton.animating = false;
            if (this.connectButton.animationTimeout) {
                clearTimeout(this.connectButton.animationTimeout);
                this.connectButton.animationTimeout = null;
            }
            this.connectButton.rotation = 0;
            this.connectButton.setTexture(this.statusReadyTexture);
            setTimeout(this.checkStageListeners.bind(this), 2000);
        } else {
            this.isConnected = false;
            this.connectButton.rotation = 0;
            this.connectButton.setTexture(this.statusNotReadyTexture);
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
    activateMotion() {
        this.motionMonitor.visible = true;
    },
    motionNeedsPermission() {
        this.motionMonitor.visible = true;
    },
    updateMotion(x, y, z) {
        if (!this.deviceHasMotion) {
            this.motionMonitor.visible = true;
            this.deviceHasMotion = true;
            this.motionInterval = setInterval(() => {
                this.emit({type: 'sensor', inputType: 'motion', name: this.motionMonitor.name, val: this.motionMonitor.getVals()});
            }, 20);
        }
        this.motionMonitor.setValue(x, y, z);
    },
    emit (event) {
        this.listeners.forEach(c => c(event));
    },
    checkStageListeners () {
        let hasStage = false;
        this.widgetContainer.children.forEach(c => {
            if (c instanceof Stage) hasStage = true;
        });
        this.emit({type: 'stage-subscription', state: hasStage});
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
