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

export type Result<T> = T extends any[] ? { [k: string]: Status } : [Status, boolean];

export function check<T = Permissions>(permission: T, options?: CheckOptions): Promise<Result<T>>;

export function request<T = Permissions | Permissions[] | string[]>(permission: T, options?: RequestOptions): Promise<Result<T>>;

export function checkMultiple<T = Permissions[]>(permissions: T): Promise<Result<T>>;
