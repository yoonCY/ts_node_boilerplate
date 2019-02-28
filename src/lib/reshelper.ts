import * as express from 'express'

export const returnData = (result: boolean = true, data: object = {}, descrption: string = "") => {

    if (data === null) data = {};

    return {
        result,
        data,
        descrption,
    }
}

export const wrap = (asyncFn: any) => {
    return (async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            return await asyncFn(req, res, next)
        } catch (error) {
            return next(error)
        }
    })
}

export const uniqueArray = (arr: Array<any>) => {
    return arr.filter((value: any, idx: number, arr: Array<any>) => arr.indexOf(value) === idx)
}

export const date = (timestamp: number | null = 0) => {

    let search_date;
    let date;

    timestamp = timestamp ? (timestamp * 1000) : 0;


    if (timestamp > 0) {
        date = new Date(timestamp);
    } else {
        date = new Date();
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const ymdhis = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const ymd = `${year}-${month}-${day}`;

    return {
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        ymdhis: ymdhis,
        ymd: ymd,
    }

}