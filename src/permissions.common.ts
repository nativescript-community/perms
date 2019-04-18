
let debug = false;
export function setDebug(value: boolean) {
    debug = value;
}

export enum CLogTypes {
    info,
    warning,
    error
}

export const CLog = (type: CLogTypes = 0, ...args) => {
    if (debug) {
        if (type === 0) {
            // Info
            console.log(...args);
        } else if (type === 1) {
            // Warning
            console.warn(...args);
        } else if (type === 2) {
            console.error(...args);
        }
    }
};
