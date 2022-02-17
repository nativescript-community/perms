export type Status = 'authorized' | 'denied' | 'limited' | 'restricted' | 'undetermined';
export const PermsTraceCategory = 'NativescriptPerms';

export type Permissions =
    | 'location'
    | 'camera'
    | 'microphone'
    | 'photo'
    | 'contacts'
    | 'event'
    | 'reminder'
    | 'bluetooth'
    | 'bluetoothConnect'
    | 'bluetoothScan'
    | 'notification'
    | 'backgroundRefresh'
    | 'speechRecognition'
    | 'mediaLocation'
    | 'mediaLibrary'
    | 'motion'
    | 'storage'
    | 'callPhone'
    | 'readSms'
    | 'receiveSms';
export interface Rationale {
    title: string;
    message: string;
    buttonPositive?: string;
    buttonNegative?: string;
    buttonNeutral?: string;
}
export type CheckOptions = string | { type: string };
export type RequestOptions = string | { type: string; rationale?: Rationale };

export function canOpenSettings(): Promise<boolean>;

export function openSettings(): Promise<boolean>;

export function getTypes(): Permissions[];

export function check(permission: Permissions | string[], options?: CheckOptions): Promise<[Status, boolean]>;

export function request(permission: Permissions | string[], options?: RequestOptions): Promise<[Status, boolean]>;

export function checkMultiple(permissions: Permissions[]): Promise<{ [k: string]: string }>;
