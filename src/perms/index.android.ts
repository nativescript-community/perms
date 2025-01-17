import { Application, Trace, Utils } from '@nativescript/core';
import { AndroidActivityRequestPermissionsEventData } from '@nativescript/core/application';
import { getBoolean, setBoolean } from '@nativescript/core/application-settings';
import { SDK_VERSION } from '@nativescript/core/utils';
import { CheckOptions, MultiResult, ObjectPermissions, ObjectPermissionsRest, Permissions as PermissionsType, RequestOptions } from '.';
import { CLog, CLogTypes, Status } from './index.common';

export * from './index.common';

const MARSHMALLOW = 23;
const ANDROIDQ = 29;
const ANDROIDS = 31;
const ANDROID13 = 33;

const NativePermissionsTypes: PermissionsType[] = [
    'location',
    'camera',
    'mediaLocation',
    'microphone',
    'contacts',
    'event',
    'storage',
    'photo',
    'video',
    'audio',
    'callPhone',
    'readSms',
    'receiveSms',
    'bluetoothScan',
    'bluetoothConnect',
    'bluetooth'
];

function getNativePermissions<T extends PermissionsType = PermissionsType>(permission: T | string, options?: RequestOptions<T>) {
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'getNativePermissions', permission, options);
    }
    switch (permission) {
        case 'location': {
            const result = [];
            const theOptions = options as RequestOptions<'location'>;
            if ((theOptions?.coarse ?? true) !== false) {
                result.push('android.permission.ACCESS_COARSE_LOCATION');
            }
            if ((theOptions?.precise ?? true) !== false) {
                result.push('android.permission.ACCESS_FINE_LOCATION');
            }
            if (SDK_VERSION >= ANDROIDQ && (theOptions?.background ?? false) === true) {
                result.push('android.permission.ACCESS_BACKGROUND_LOCATION');
            }
            return result;
        }
        case 'camera': {
            return ['android.permission.CAMERA'];
        }
        case 'mediaLocation': {
            if (SDK_VERSION >= ANDROIDQ) {
                return ['android.permission.ACCESS_MEDIA_LOCATION'];
            }
            break;
        }
        case 'microphone': {
            return ['android.permission.RECORD_AUDIO'];
        }
        case 'contacts': {
            return ['android.permission.READ_CONTACTS'];
        }
        case 'event': {
            return ['android.permission.READ_CALENDAR'];
        }
        case 'storage': {
            const result = [];
            const theOptions = options as RequestOptions<'storage'>;
            // const manage = options?.manage?? true;
            if ((theOptions?.read ?? true) !== false) {
                result.push('android.permission.READ_EXTERNAL_STORAGE');
            }
            if ((theOptions?.write ?? true) !== false) {
                result.push('android.permission.WRITE_EXTERNAL_STORAGE');
            }
            // if (manage !== false) {
            //     result.push('android.permission.MANAGE_EXTERNAL_STORAGE');
            // }
            return result;
        }
        case 'photo': {
            if (SDK_VERSION >= ANDROID13) {
                return ['android.permission.READ_MEDIA_IMAGES'];
            }
            return ['android.permission.READ_EXTERNAL_STORAGE'];
        }
        case 'video': {
            if (SDK_VERSION >= ANDROID13) {
                return ['android.permission.READ_MEDIA_VIDEO'];
            }
            return ['android.permission.READ_EXTERNAL_STORAGE'];
        }
        case 'audio': {
            if (SDK_VERSION >= ANDROID13) {
                return ['android.permission.READ_MEDIA_AUDIO'];
            }
            return ['android.permission.READ_EXTERNAL_STORAGE'];
        }
        case 'callPhone': {
            return ['android.permission.CALL_PHONE'];
        }
        case 'readSms': {
            return ['android.permission.READ_SMS'];
        }
        case 'receiveSms': {
            return ['android.permission.RECEIVE_SMS'];
        }
        case 'bluetoothScan': {
            if (SDK_VERSION >= ANDROIDS) {
                return ['android.permission.BLUETOOTH_SCAN'];
            }
            break;
        }
        case 'bluetoothConnect': {
            if (SDK_VERSION >= ANDROIDS) {
                return ['android.permission.BLUETOOTH_CONNECT'];
            }
            break;
        }
        case 'bluetooth': {
            if (SDK_VERSION >= ANDROIDS) {
                return ['android.permission.BLUETOOTH_ADVERTISE'];
            }
            break;
        }
        case 'notification': {
            if (SDK_VERSION >= ANDROID13) {
                // @ts-ignore
                return ['android.permission.POST_NOTIFICATIONS'];
            }
            break;
        }
        default:
            return [permission];
    }
    return [];
}

const STORAGE_KEY = '@NSPermissions:didAskPermission:';

const setDidAskOnce = (permission: string) => Promise.resolve().then(() => setBoolean(STORAGE_KEY + permission, true));

const getDidAskOnce = (permission: string) => Promise.resolve(!!getBoolean(STORAGE_KEY + permission));

namespace PermissionsAndroid {
    /**
     * A list of specified "dangerous" permissions that require prompting the user
     */
    // export const PERMISSIONS = {
    //     READ_CALENDAR: 'android.permission.READ_CALENDAR',
    //     WRITE_CALENDAR: 'android.permission.WRITE_CALENDAR',
    //     CAMERA: 'android.permission.CAMERA',
    //     READ_CONTACTS: 'android.permission.READ_CONTACTS',
    //     WRITE_CONTACTS: 'android.permission.WRITE_CONTACTS',
    //     GET_ACCOUNTS: 'android.permission.GET_ACCOUNTS',
    //     ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    //     ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
    //     RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
    //     READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE',
    //     CALL_PHONE: 'android.permission.CALL_PHONE',
    //     READ_CALL_LOG: 'android.permission.READ_CALL_LOG',
    //     WRITE_CALL_LOG: 'android.permission.WRITE_CALL_LOG',
    //     ADD_VOICEMAIL: 'com.android.voicemail.permission.ADD_VOICEMAIL',
    //     USE_SIP: 'android.permission.USE_SIP',
    //     PROCESS_OUTGOING_CALLS: 'android.permission.PROCESS_OUTGOING_CALLS',
    //     BODY_SENSORS: 'android.permission.BODY_SENSORS',
    //     SEND_SMS: 'android.permission.SEND_SMS',
    //     RECEIVE_SMS: 'android.permission.RECEIVE_SMS',
    //     READ_SMS: 'android.permission.READ_SMS',
    //     RECEIVE_WAP_PUSH: 'android.permission.RECEIVE_WAP_PUSH',
    //     RECEIVE_MMS: 'android.permission.RECEIVE_MMS',
    //     READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    //     WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE'
    // };

    /**
     * Returns a promise resolving to a boolean value as to whether the specified
     * permissions has been granted
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#check
     */
    export async function check(permission: string | string[]) {
        const context = Utils.android.getApplicationContext();
        let result = true;
        const granted = android.content.pm.PackageManager.PERMISSION_GRANTED;
        if (!Array.isArray(permission)) {
            permission = [permission];
        }
        if (SDK_VERSION < MARSHMALLOW) {
            permission.forEach((p) => (result = result && context.checkPermission(p, android.os.Process.myPid(), android.os.Process.myUid()) === granted));
        } else {
            permission.forEach((p) => (result = result && context.checkSelfPermission(p) === granted));
        }
        return result;
    }

    /**
     * Prompts the user to enable a permission and returns a promise resolving to a
     * string value indicating whether the user allowed or denied the request
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#request
     */
    export async function request(permission: string): Promise<Status> {
        // if (rationale) {
        //     const shouldShowRationale = await shouldShowRequestPermissionRationale(permission);

        //     if (shouldShowRationale) {
        //         return new Promise((resolve, reject) => {

        //             NativeModules.DialogManagerAndroid.showAlert(rationale, () => reject(new Error('Error showing rationale')), () => resolve(requestPermission(permission)));
        //         });
        //     }
        // }
        return (await requestMultiplePermissions([permission]))[permission];
    }

    /**
     * Prompts the user to enable multiple permissions in the same dialog and
     * returns an object with the permissions as keys and strings as values
     * indicating whether the user allowed or denied the request
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#requestmultiple
     */
    export function requestMultiple(permissions: string[]): Promise<{ [permission: string]: Status }> {
        return requestMultiplePermissions(permissions);
    }
}

// PermissionsAndroid = new PermissionsAndroid();

let mRequestCode = 0;
async function requestMultiplePermissions(permissions: string[]): Promise<{ [permission: string]: Status }> {
    const grantedPermissions = {};
    const permissionsToCheck = [];
    let checkedPermissionsCount = 0;
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'requestMultiplePermissions', permissions);
    }
    const context = Utils.android.getApplicationContext();

    for (let i = 0; i < permissions.length; i++) {
        const perm = permissions[i];

        if (SDK_VERSION < MARSHMALLOW) {
            grantedPermissions[perm] =
                context.checkPermission(perm, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED ? Status.Authorized : Status.Denied;
            checkedPermissionsCount++;
        } else if (context.checkSelfPermission(perm) === android.content.pm.PackageManager.PERMISSION_GRANTED) {
            grantedPermissions[perm] = Status.Authorized;
            checkedPermissionsCount++;
        } else {
            permissionsToCheck.push(perm);
        }
    }
    if (permissions.length === checkedPermissionsCount) {
        return grantedPermissions;
    }
    const activity: android.app.Activity = Application.android.foregroundActivity || Application.android.startActivity;
    return new Promise((resolve, reject) => {
        try {
            const requestCode = mRequestCode++;
            if (Trace.isEnabled()) {
                CLog(CLogTypes.info, 'requestPermissions', permissionsToCheck);
            }
            activity.requestPermissions(permissionsToCheck, requestCode);
            const onActivityResult = (args: AndroidActivityRequestPermissionsEventData) => {
                if (args.requestCode === requestCode) {
                    Application.android.off(Application.android.activityRequestPermissionsEvent, onActivityResult);
                    const results = args.grantResults;
                    if (Trace.isEnabled()) {
                        CLog(CLogTypes.info, 'requestPermissions results', results);
                    }
                    for (let j = 0; j < permissionsToCheck.length; j++) {
                        const permission = permissionsToCheck[j];
                        if (results.length > j && results[j] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                            grantedPermissions[permission] = Status.Authorized;
                        } else {
                            if (activity.shouldShowRequestPermissionRationale(permission)) {
                                grantedPermissions[permission] = Status.Denied;
                            } else {
                                grantedPermissions[permission] = Status.NeverAskAgain;
                            }
                        }
                    }
                    resolve(grantedPermissions);
                }
            };
            Application.android.on(Application.android.activityRequestPermissionsEvent, onActivityResult);
        } catch (e) {
            reject(e);
        }
    });
}

function shouldShowRequestPermissionRationale(permission: string | string[]) {
    if (SDK_VERSION < MARSHMALLOW) {
        return Promise.resolve(false);
    }
    const activity: android.app.Activity = Application.android.foregroundActivity || Application.android.startActivity;
    try {
        if (Array.isArray(permission)) {
            return Promise.resolve(permission.reduce((accu, p) => accu && activity.shouldShowRequestPermissionRationale(p), true));
        }
        return Promise.resolve(activity.shouldShowRequestPermissionRationale(permission));
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function canOpenSettings() {
    return true;
}

const SETTINGS_REQUEST = 5140;
export function openSettings() {
    const activity = Application.android.foregroundActivity || Application.android.startActivity;
    return new Promise<void>((resolve, reject) => {
        const onActivityResultHandler = (data) => {
            if (data.requestCode === 5140) {
                Application.android.off(Application.android.activityResultEvent, onActivityResultHandler);
                resolve();
            }
        };
        Application.android.on(Application.android.activityResultEvent, onActivityResultHandler);
        const intent = new android.content.Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(android.net.Uri.parse('package:' + activity.getPackageName()));
        activity.startActivityForResult(intent, SETTINGS_REQUEST);
    });
}
const NOTIF_SETTINGS_REQUEST = 5141;
export function openNotificationSettings() {
    const activity = Application.android.foregroundActivity || Application.android.startActivity;
    return new Promise<void>((resolve, reject) => {
        const onActivityResultHandler = (data) => {
            if (data.requestCode === NOTIF_SETTINGS_REQUEST) {
                Application.android.off(Application.android.activityResultEvent, onActivityResultHandler);
                resolve();
            }
        };

        Application.android.on(Application.android.activityResultEvent, onActivityResultHandler);
        const intent = new android.content.Intent();
        if (SDK_VERSION >= 25) {
            intent.setAction(android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, activity.getPackageName());
        } else {
            intent.setAction(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            const uri = android.net.Uri.fromParts('package', activity.getPackageName(), null);
            intent.setData(uri);
        }
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivityForResult(intent, NOTIF_SETTINGS_REQUEST);
    });
}

export function getTypes() {
    return NativePermissionsTypes;
}

export async function check(permission: PermissionsType | string, options?: CheckOptions): Promise<Status> {
    const perms: string | string[] = getNativePermissions(permission, options);
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'check', permission, options, SDK_VERSION, perms);
    }
    if (!perms || perms.length === 0) {
        return Status.Authorized;
    }

    const isAuthorized = await PermissionsAndroid.check(perms);
    if (isAuthorized) {
        if (SDK_VERSION >= ANDROIDQ && permission === 'location') {
            const type = typeof options === 'string' ? options : options && options.type;
            if (type === 'always') {
                const backAuthorized = await PermissionsAndroid.check('android.permission.ACCESS_BACKGROUND_LOCATION');
                return backAuthorized ? Status.Authorized : Status.Denied;
            }
        }
        return Status.Authorized;
    }

    return getDidAskOnce(permission).then((didAsk) => {
        if (didAsk) {
            return shouldShowRequestPermissionRationale(perms).then((shouldShow) => (shouldShow ? Status.Denied : Status.Restricted));
        }

        return Status.Undetermined;
    });
}

export function request(permission: PermissionsType | string | ObjectPermissions, options?: RequestOptions): Promise<Status | { [permission: string]: Status }> {
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'request', permission, options);
    }
    let types: string[] = [];
    let permissions: string[] = [];
    if (typeof permission === 'object') {
        // const keys =  as IOSPermissionTypes[];
        permissions = Object.keys(permission);
        permissions.forEach((s) => {
            // if (s.startsWith('android.permission.')) {
            //     types.push(s);
            // } else {
            types.push(...getNativePermissions(s as PermissionsType, permission[s]));
            // }
        });
    } else {
        permissions = [permission];
        // if (permission.startsWith('android.permission.')) {
        //     types.push(permission);
        // } else {
        types = getNativePermissions(permission, options);
        // }
    }
    if (types.length === 0) {
        // if (Trace.isEnabled()) {
        //     CLog(CLogTypes.warning, permission, 'is not a valid permission type on Android');
        // }
        return Promise.resolve(Status.Authorized);
    }

    if (types.length > 1) {
        return requestMultiplePermissions(types);
    }
    return PermissionsAndroid.request(types[0]).then((result) => {
        // PermissionsAndroid.request() to native module resolves to boolean
        // rather than string if running on OS version prior to Android M
        if (typeof result === 'boolean') {
            return result ? Status.Authorized : Status.Denied;
        }

        if (permissions.length > 1) {
            return Promise.all(permissions.map(setDidAskOnce)).then(() => result);
        }
        return setDidAskOnce(permissions[0]).then(() => result);
    });
}

export function checkMultiple<T extends Partial<ObjectPermissionsRest>>(permissions: T): Promise<MultiResult> {
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'checkMultiple', permissions);
    }
    return Promise.all(Object.keys(permissions).map((permission) => check(permission, permissions[permission]).then((r) => [permission, r]))).then((result) =>
        result.reduce((acc, value: [string, Status], index) => {
            acc[value[0]] = value[1];
            return acc;
        }, {} as MultiResult)
    );
}
