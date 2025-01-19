const WARN_VINE_TIME = 35000; // 5 secondes pour avertir qu'on a pas reçu de message
const WARN_MASTER_TIME = 35000; // 5 secondes pour avertir qu'on a pas reçu de message

function createCanvas() {
    const grid = document.getElementById('grid');
    const canvas = document.createElement('canvas');
    canvas.width = "1920";
    canvas.height = "1080";
    grid.appendChild(canvas);
    return canvas.getContext('2d');
}

function createLine(x1, y1, x2, y2) {
    const grid = document.getElementById('grid');

    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.margin = '20px';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.setAttribute('height', '400');
    svg.style.border = '1px solid #ccc';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', '2');

    svg.appendChild(line);

    container.appendChild(svg);

    grid.appendChild(container);
}

function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formattedDate;
}

function createVineEmpty() {
    const img = document.createElement('img');
    img.src = 'img/vine.png';
    return img;
}

function createVine(json) {
    const grid = document.getElementById('grid');
    const popup = document.querySelector('.popup');

    const context = createCanvas();

    context.lineWidth = 3;

    context.beginPath();
    context.moveTo(100, 130);
    context.lineTo(1817, 130);

    for (let i = 0; i < json.length; i++) {

        if (typeof json[i] != 'number') {
            const div = document.createElement('div');

            context.moveTo(155 * i - 48, 130);
            context.lineTo(155 * i - 48, 930);

            for (let j = 0; j < json[i].length; j++) {
                const img = document.createElement('img');
                img.src = 'img/esp32.webp';
                img.id = i + '_' + j;
                img.classList.add('esp32');

                const valid = document.createElement('i');
                valid.className = 'vine_state success fa-solid fa-check';
                valid.id = 'state_' + i + '_' + j;

                img.classList.add('disable')

                /*
                img.addEventListener('click', () => {
                    if (img.classList.contains('disable'))
                        img.classList.remove('disable');
                    else
                        img.classList.add('disable');
                });*/

                img.addEventListener('mousemove', (e) => {
                    popup.style.left = (e.clientX + 5) + 'px';
                    popup.style.top = (e.clientY + 5) + 'px';
                });

                img.addEventListener('mouseleave', (e) => {
                    popup.style.display = 'none';
                });

                div.appendChild(valid);
                div.appendChild(img);

                if (j != json[i].length - 1) {
                    div.appendChild(createVineEmpty());
                    div.appendChild(createVineEmpty());
                }
            }

            div.style.left = (i * 6.2 + 1) + "vw";
            grid.appendChild(div);
        }
    }

    context.moveTo(1817, 130);
    context.lineTo(1817, 930);

    context.stroke();
}

function updateVine(json) {

    const popup = document.querySelector('.popup');
    const popupTitle = popup.querySelector('h2');
    const popupContent = popup.querySelector('span');

    const masterNode = document.querySelector('section[id="master"] span');

    for (let i = 0; i < json.length; i++) {
        if (typeof json[i] != 'number') {
            for (let j = 0; j < json[i].length; j++) {
                const img = document.getElementById(i + '_' + j);
                const valid = document.getElementById('state_' + i + '_' + j);

                if (img) {
                    const id = j + (i * json[i].length) + 1;

                    const [value, lastTime, sick] = json[i][j];

                    if (sick) {
                        if (!img.classList.contains('sick'))
                            img.classList.add('sick')
                    }
                    else {
                        if (img.classList.contains('sick'))
                            img.classList.remove('sick')
                    }

                    if (value == -1) {
                        if (!img.classList.contains('disable'))
                            img.classList.add('disable')
                    }
                    else {
                        if (img.classList.contains('disable'))
                            img.classList.remove('disable')
                    }

                    let state = 'success';
                    let type = 'fa-check';

                    if (value == null) {
                        state = 'error';
                        type = 'fa-triangle-exclamation';
                    }
                    else if (value == -1 || lastTime == -1) {
                        state = 'error';
                        type = 'fa-solid fa-xmark';
                    }

                    else if (Date.now() - lastTime > WARN_VINE_TIME) {
                        state = 'warning';
                        type = 'fa-triangle-exclamation';
                    }

                    img.errType = state;
                    img.lastTime = lastTime;
                    valid.className = 'vine_state ' + state + ' fa-solid ' + type;

                    function update() {
                        if (id == 1)
                            updateMaster();
                        else
                            popupContent.innerHTML = `Humidité: <b class="${img.errType}">${value > -1 ? value + '%' : 'Aucune valeur'}</b><br>Dernière update: <b class="${img.errType}">${lastTime == -1 ? 'Aucune donné reçu' : convertTimestampToDate(lastTime)}</b><br>Plant malade: <b class="${sick ? 'error' : 'success'}">${sick ? 'OUI' : 'NON'}</b>`;
                    }

                    function updateMaster() {
                        let image = document.getElementById('0_1');
                        popupContent.innerHTML = `<center>ESP 1</center><hr>Humidité: <b class="${image.errType}">${image.prevValues > -1 ? image.prevValues + '%' : 'Aucune valeur'}</b><br>Dernière update: <b class="${img.errType}">${lastTime == -1 ? 'Aucune donné reçu' : convertTimestampToDate(image.lastTime)}</b><br>Plant malade: <b class="${image.prevSick  ? 'error' : 'success'}">${image.prevSick ? 'OUI' : 'NON'}</b>`;
                        image = document.getElementById('0_2');
                        popupContent.innerHTML += `<center>ESP 2</center><hr>Humidité: <b class="${image.errType}">${image.prevValues > -1 ? image.prevValues + '%' : 'Aucune valeur'}</b><br>Dernière update: <b class="${img.errType}">${lastTime == -1 ? 'Aucune donné reçu' : convertTimestampToDate(image.lastTime)}</b><br>Plant malade: <b class="${image.prevSick  ? 'error' : 'success'}">${image.prevSick ? 'OUI' : 'NON'}</b>`;
                    }

                    if (popupTitle.focusImg == img.id)
                        update();

                    if (img.prevValues == undefined) {
                        img.prevValues = value;
                        img.prevSick = sick;
                    }

                    else if (value != img.prevValues || sick != img.prevSick) {
                        img.prevValues = value;
                        img.prevSick = sick;
                        setTimeout(() => {
                            img.style.animation = '.7s bounds';
                            setTimeout(() => img.style.animation = '', 800);
                        }, 100 * id);
                    }

                    img.onmouseenter = () => {
                        if (!img.classList.contains('disable')) {
                            if (id == 1)
                                popupTitle.innerText = 'ESP MASTER - ' + id;
                            else
                                popupTitle.innerText = 'ESP - ' + id;

                            popupTitle.focusImg = img.id;
                            update();
                            popup.style.display = 'block';
                            popup.className = "popup popup_" + id;
                        }
                    }

                }
            }
        }
        else {
            const timestamp = json[i];
            if (masterNode) {

                if (timestamp == -2) {
                    masterNode.innerText = `Le master ne répond pas.`;
                    masterNode.className = 'error';
                }
                else if (timestamp == -1) {
                    masterNode.innerText = `Dernière update: Aucune`;
                    masterNode.className = 'error';
                }
                else if (Date.now() - timestamp > WARN_MASTER_TIME) {
                    masterNode.innerText = `Dernière update\n${convertTimestampToDate(timestamp)}`;
                    masterNode.className = 'warning';
                }
                else {
                    masterNode.innerText = `Dernière update\n${convertTimestampToDate(timestamp)}`;
                    masterNode.className = 'success';
                }
            }
        }
    }
}

function irrigation(socket) {
    const auto = document.getElementById('switch');
    const activator = document.getElementById('switch-2');
    const activatorNode = document.querySelector('.switch_input+.switch_input');

    auto.addEventListener('input', (e) => {
        if (auto.checked) {
            if (!activatorNode.classList.contains('disable'))
                activatorNode.classList.add('disable');
        }
        else {
            if (activatorNode.classList.contains('disable'))
                activatorNode.classList.remove('disable');
        }

        socket.emit('irrigation_auto', auto.checked);
    });

    activator.addEventListener('input', () => {
        if (!auto.checked)
            socket.emit('irrigation_enable', activator.checked);
    });
}

function irrigationServer(autoEnable, enable, state) {
    const auto = document.getElementById('switch');
    const activator = document.getElementById('switch-2');
    const activatorNode = document.querySelector('.switch_input+.switch_input');
    const stateNode = document.querySelector('section[id="irrigation"]>span');

    auto.checked = autoEnable;
    activator.checked = enable;

    if (auto.checked) {
        if (!activatorNode.classList.contains('disable'))
            activatorNode.classList.add('disable');

        if (state == 0)
            stateNode.innerHTML = '<b>Prévision:</b> Aucune pluie attendu, système d\'irrigation activé.';

        else if (state == 1)
            stateNode.innerHTML = '<b>Prévision:</b> Pluie attendu dans la journée, système d\'irrigation désactivé.';

        else if (state == 2)
            stateNode.innerHTML = '<b>Prévision:</b> Pluie attendu demain, système d\'irrigation désactivé.';
    }
    else {
        stateNode.innerHTML = '<b>Prévision:</b> Mode automatique désactiver';
        if (activatorNode.classList.contains('disable'))
            activatorNode.classList.remove('disable');
    }
}

async function main() {
    const response = await fetch('/api/vines');
    const json = await response.json();

    const socket = io();

    irrigation(socket);

    createVine(json);
    updateVine(json);

    socket.on('vines', (json) => {
        updateVine(json);
    });

    socket.on('irrigation', irrigationServer);
}

window.addEventListener('load', main);