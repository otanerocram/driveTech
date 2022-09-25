type EventType = {
    type:
        | 'GPS'
        | 'IDLING'
        | 'IGN'
        | 'SOS'
        | 'OVER_SPEED'
        | 'LOW_BATTERY'
        | 'DRIVER_ID'
        | 'DOOR'
        | 'GPS_SIGNAL';
    status?: boolean;
    driver_id?: string;
    duration?: number;
};

type DataStates =
    | 'Tow'
    | 'Ignition On Rest'
    | 'Ignition Off Rest'
    | 'Ignition On Moving'
    | 'Idling';

export interface IDataRow {
    posicionId: number;
    vehiculoId: string;
    velocidad: number;
    satelites: number;
    rumbo: number;
    latitud: number;
    longitud: number;
    altitud: number;
    gpsDateTime: string;
    statusCode: number;
    ignition: number;
    odometro: number;
    horometro: number;
    nivelBateria: number;
    estado: string;
}

export interface IPacketToSend {
    plate: string;
    buff: boolean;
    datetime: string;
    latitude: number;
    longitude: number;
    speed: number;
    azimuth: number;
    state: DataStates;
    event: EventType;
    ign_input: boolean;
    odometer: number;
    altitude?: number;
    doors?: boolean;
    gps_status?: boolean;
    hourmeter?: number;
    battery?: number;
    power_supply?: number;
    temperature1?: number;
    temperature2?: number;
    temperature3?: number;
    fuel_percentage?: number;
    mcc?: number;
    mnc?: number;
    lac?: number;
    cid?: number;
}

export interface IResponse {
    success: boolean;
}

export interface IResponseFail {
    success: boolean;
    data?: IResponseError;
}

export interface IResponseSuccess {
    success: boolean;
    data?: Array<IDataRow>;
}

export type IResponseError = {
    code: string;
    errno: number;
    sqlMessage: string;
    sqlState: string;
    sql: string;
};

export interface IUpdateSql {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    changedRows: number;
    warningStatus: number;
    info: string;
}
