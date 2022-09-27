import { api, app } from './connection/secure';
import { pool } from './database/connection';
import {
    IPacketToSend,
    IResponse,
    IResponseFail,
    IResponseSuccess,
    IUpdateSql,
} from './model/interfaces';
import axios from 'axios';

const getTracks = new Promise((resolve) => {
    pool.query(app.sqlQuery, (err, results) => {
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
});

const mainLoop = () => {
    getTracks.then((results) => {
        const { success } = results as IResponse;

        if (!success) {
            const { data } = results as IResponseFail;
            console.log(data?.sql);
            return;
        }

        const { data } = results as IResponseSuccess;

        const tracks = [] as Array<IPacketToSend>;
        const ids = [] as Array<number>;

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

        console.log('Tracks sent', tracks);

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

                    const sql = `${app.sqlUpdate} IN (${ids.join(',')})`;

                    pool.query(sql, (err, results) => {
                        const { info } = results as IUpdateSql;
                        console.log(info, ids);
                    });
                } else {
                    console.log('Error', res);
                }
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    });
};

mainLoop();

const interval = setInterval(mainLoop, 10000);
