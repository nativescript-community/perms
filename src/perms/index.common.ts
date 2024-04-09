import { Trace } from '@nativescript/core';
import type { MultiResult, Result } from '.';
export const PermsTraceCategory = 'NativescriptPerms';

export enum CLogTypes {
    log = Trace.messageType.log,
    info = Trace.messageType.info,
    warning = Trace.messageType.warn,
    error = Trace.messageType.error
}

export const CLog = (type: CLogTypes, ...args) => {
    Trace.write(args.map((a) => (a && typeof a === 'object' ? JSON.stringify(a) : a)).join(' '), PermsTraceCategory, type);
};

export function isPermResultAuthorized(r: MultiResult | Result) {
    if (Array.isArray(r)) {
        return r[0] === 'authorized';
    } else {
        const unauthorized = Object.keys(r).some((s) => r[s] !== 'authorized');
        return !unauthorized;
    }
}
