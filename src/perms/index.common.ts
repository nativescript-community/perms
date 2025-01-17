import { Trace } from '@nativescript/core';
import type { MultiResult } from '.';
export const PermsTraceCategory = 'NativescriptPerms';

export enum Status {
    Undetermined = 'undetermined',
    Denied = 'denied',
    Authorized = 'authorized',
    Limited = 'limited',
    Restricted = 'restricted',
    NeverAskAgain = 'never_ask_again'
}

export enum CLogTypes {
    log = Trace.messageType.log,
    info = Trace.messageType.info,
    warning = Trace.messageType.warn,
    error = Trace.messageType.error
}

export const CLog = (type: CLogTypes, ...args) => {
    Trace.write(args.map((a) => (a && typeof a === 'object' ? JSON.stringify(a) : a)).join(' '), PermsTraceCategory, type);
};

export function isPermResultAuthorized(r: MultiResult | Status) {
    if (typeof r === 'object') {
        const unauthorized = Object.keys(r).some((s) => r[s] !== Status.Authorized);
        return !unauthorized;
    }
    return r === Status.Authorized;
}
