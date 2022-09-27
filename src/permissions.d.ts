export type Status = 'authorized' | 'denied' | 'limited' | 'restricted' | 'undetermined' | 'never_ask_again';
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

export interface LocationOptions {
    [k: string]: any;
    type: string;
    coarce?: boolean;
    precise?: boolean;
}
export interface StorageOptions {
    [k: string]: any;
    read?: boolean;
    write?: boolean;
}

export type CheckOptions = string | LocationOptions | StorageOptions;
export type RequestOptions = string | LocationOptions | StorageOptions;

export function canOpenSettings(): Promise<boolean>;

export function openSettings(): Promise<boolean>;

export function getTypes(): Permissions[];

export type Result<T> = T extends any[] ? { [k: string]: Status } : [Status, boolean];

export function check<T = Permissions | string>(permission: T, options?: CheckOptions): Promise<Result<T>>;

export function request<T = Permissions | Permissions[] | string[]>(permission: T, options?: RequestOptions): Promise<Result<T>>;

export function checkMultiple<T = Permissions[]>(permissions: T): Promise<Result<T>>;
