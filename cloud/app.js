const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const VineLine = require('./assets/VineLine');
const Vine = require('./assets/Vine');
const Irrigation = require('./assets/Irrigation');
const Master = require('./assets/Master');
const app = express();

let lines = new Array();

const NB_LINES = 12;
const VINE_PER_LINE = 3;

const master = new Master();

for (let i = 0; i < NB_LINES; i++) {
    const line = new VineLine();

    for (let j = 0; j < VINE_PER_LINE; j++)
        line.add(new Vine());

    lines.push(line);
}

const irrigation = new Irrigation();

app.use(express.json());

app.get('/api/vines', (req, res) => {
    let json = new Array();

    for (const line of lines) {
        const l = new Array();

        for (const vine of line.toArray())
            l.push([vine.isEnable() ? vine.getValue() : -1, vine.getLastTime(), vine.getSick() + 0]);

        json.push(l);
    }

    json.push(master.isEnable() ? master.getLastTime() : -2);
    res.send(JSON.stringify(json));
});


app.use(express.static('htdocs'));

const server = http.createServer(app);
const io = new Server(server);

app.post('/api/data', (req, res) => {
    for (const key in req.body) {
        const value = req.body[key];

        if (key.startsWith('ESP_')) {
            const id = parseInt(key.split('_')[1]) - 1;

            const vine = lines[Math.floor(id / NB_LINES)].toArray()[id % VINE_PER_LINE];

            vine.enable();
            vine.setValue(value);
        }
        else if (key == 'MASTER') {
            if (value == 'OK')
                master.update();

            else
                master.off();
        }
    }

    sendVines();

    res.send('OK');
});

app.post('/api/sick', (req, res) => {
    for (const key in req.body) {
        if (key.startsWith('ESP_')) {
            const id = parseInt(key.split('_')[1]) - 1;
            const value = req.body[key];

            const vine = lines[Math.floor(id / NB_LINES)].toArray()[id % VINE_PER_LINE];

            vine.setSick(value == '1');
        }
    }
    sendVines();
    res.send('OK');
});

function sendVines() {

    const json = new Array();

    for (const line of lines) {
        const l = new Array();

        for (const vine of line.toArray())
            l.push([vine.isEnable() ? vine.getValue() : -1, vine.getLastTime(), vine.getSick() + 0]);

        json.push(l);
    }

    json.push(master.isEnable() ? master.getLastTime() : -2);
    io.emit('vines', json);
}

async function updateIrrigation() {

    const isAuto = irrigation.isAuto();
    let autoState = 0;

    if (isAuto) {
        const isEnable = irrigation.isEnable();
        const [hasRain, state] = await irrigation.hasRain();

        autoState = state;

        if (isEnable == hasRain) {
            if (hasRain)
                irrigation.disable();
            else
                irrigation.enable();
        }
    }

    io.emit('irrigation', isAuto, irrigation.isEnable(), autoState);
}


io.on('connection', (socket) => {
    updateIrrigation();

    socket.on('irrigation_auto', (enable) => {
        irrigation.setAuto(enable);
        updateIrrigation();
    });

    socket.on('irrigation_enable', (enable) => {
        if (!irrigation.isAuto()) {

            if (enable)
                irrigation.enable();
            else
                irrigation.disable();

            updateIrrigation();
        }
    });
});

setInterval(updateIrrigation, 10 * 1000); // 10 secondes;
setInterval(sendVines, 1000); // 1 secondes
updateIrrigation();

server.listen(80, () => {
    console.log('-> Server: OK');
})