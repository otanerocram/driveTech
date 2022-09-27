import { api, app } from './connection/secure';
import { connection } from './database/connection';
import {
    IPacketToSend,
    IResponse,
    IResponseFail,
    IResponseSuccess,
    IUpdateSql,
} from './model/interfaces';
import axios from 'axios';
import fs from 'fs';
import util from 'util';
import { json } from 'node:stream/consumers';

const logFile = fs.createWriteStream('dataSent.json', { flags: 'a' });
const responsesFile = fs.createWriteStream('responses.json', { flags: 'a' });

const tracks = [] as Array<IPacketToSend>;
const ids = [] as Array<number>;

const mainLoop = () => {
    tracks.length = 0;
    ids.length = 0;
    new Promise((resolve) => {
        connection.query(app.sqlQuery, (err, results) => {
            logFile.write(util.format(json, JSON.stringify(results)));

            if (err) {
                resolve({
                    success: false,
                    data: err,
                });
            } else {
                resolve({
                    success: true,
                    data: results,
                });
            }
        });
    }).then((results) => {
        const { success } = results as IResponse;

        if (!success) {
            const { data } = results as IResponseFail;
            console.log(data?.sql);
            return;
        }

        const { data } = results as IResponseSuccess;

        if (data?.length === 0) {
            console.log('No hay datos nuevos');
            resetTimer();
            return;
        }

        data?.forEach((item) => {
            const track = {
                plate: item.vehiculoId,
                buff: false,
                datetime: item.gpsDateTime + 'Z',
                latitude: item.latitud,
                longitude: item.longitud,
                speed: item.velocidad,
                azimuth: item.rumbo,
                state: 'Idling',
                event: {
                    type: 'GPS',
                },
                ign_input: Boolean(item.ignition),
                odometer: item.odometro,
            } as IPacketToSend;
            tracks.push(track);
            ids.push(item.posicionId);
        });

        const { hostname, path, headers, method } = api;
        const url = `https://${hostname}${path}`;

        axios({
            url,
            method,
            headers,
            data: JSON.stringify(tracks),
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log('Api Response ->', res.data);
                    responsesFile.write(
                        util.format(json, JSON.stringify(res.data)),
                    );

                    const sql = `${app.sqlUpdate} IN (${ids.join(',')})`;

                    connection.query(sql, (err, results) => {
                        const { info } = results as IUpdateSql;
                        console.log(info, ids);
                        resetTimer();
                    });
                } else {
                    console.log('Error', res);
                    resetTimer();
                }
            })
            .catch((err) => {
                console.log(err.response.data);
                resetTimer();
            });
    });
};

function resetTimer() {
    setTimeout(() => {
        mainLoop();
    }, 10000);
}

mainLoop();
