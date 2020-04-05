import { CheckOptions, RequestOptions } from './permissions';
import { CLog, CLogTypes } from './permissions.common';
export * from './permissions.common';

export namespace PermissionsIOS {
    export enum Status {
        Undetermined = 'undetermined',
        Denied = 'denied',
        Authorized = 'authorized',
        Restricted = 'restricted'
    }
    namespace NSPLocation {
        let status: Status = Status.Undetermined;
        function getStatusFromCLAuthorizationStatus(lStatus: CLAuthorizationStatus, type?: string): [Status, boolean] {
            let always = false;
            switch (lStatus) {
                case CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedAlways:
                    always = true;
                    status = Status.Authorized;
                    break;
                case CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedWhenInUse:
                    status = Status.Authorized;
                    break;
                case CLAuthorizationStatus.kCLAuthorizationStatusDenied:
                    status = Status.Denied;
                    break;
                case CLAuthorizationStatus.kCLAuthorizationStatusRestricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            CLog(CLogTypes.info, 'NSPLocation getStatusFromCLAuthorizationStatus', lStatus, type, status, always);
            return [status, always];
        }
        export function getStatusForType(type?: string): [Status, boolean] {
            const status2 = CLLocationManager.authorizationStatus();
            return getStatusFromCLAuthorizationStatus(status2, type);
        }
        let locationManager: CLLocationManager;
        let locationManagerDelegate: CLLocationManagerDelegateImpl;
        export type SubCLLocationManagerDelegate = Partial<CLLocationManagerDelegate>;
        export class CLLocationManagerDelegateImpl extends NSObject implements CLLocationManagerDelegate {
            public static ObjCProtocols = [CLLocationManagerDelegate];

            private subDelegates: SubCLLocationManagerDelegate[];

            public addSubDelegate(delegate: SubCLLocationManagerDelegate) {
                if (!this.subDelegates) {
                    this.subDelegates = [];
                }
                const index = this.subDelegates.indexOf(delegate);
                if (index === -1) {
                    this.subDelegates.push(delegate);
                }
            }

            public removeSubDelegate(delegate: SubCLLocationManagerDelegate) {
                const index = this.subDelegates.indexOf(delegate);
                if (index !== -1) {
                    this.subDelegates.splice(index, 1);
                }
            }
            static new(): CLLocationManagerDelegateImpl {
                return super.new() as CLLocationManagerDelegateImpl;
            }
            public initDelegate() {
                this.subDelegates = [];
                return this;
            }
            locationManagerDidChangeAuthorizationStatus(manager, status: CLAuthorizationStatus) {
                this.subDelegates &&
                    this.subDelegates.forEach(d => {
                        if (d.locationManagerDidChangeAuthorizationStatus) {
                            d.locationManagerDidChangeAuthorizationStatus(manager, status);
                        }
                    });
            }
        }
        export function request(type): Promise<[Status, boolean]> {
            const status = getStatusForType(type);
            CLog(CLogTypes.info, 'NSPLocation request', type, status);
            if (status[0] === Status.Undetermined) {
                return new Promise((resolve, reject) => {
                    if (!locationManager) {
                        locationManager = CLLocationManager.new();
                    }
                    if (!locationManagerDelegate) {
                        locationManagerDelegate = CLLocationManagerDelegateImpl.new().initDelegate();
                        locationManager.delegate = locationManagerDelegate;
                    }
                    const subD = {
                        locationManagerDidChangeAuthorizationStatus: (manager, status: CLAuthorizationStatus) => {
                            CLog(CLogTypes.info, 'locationManagerDidChangeAuthorizationStatus', status);
                            if (status !== CLAuthorizationStatus.kCLAuthorizationStatusNotDetermined) {
                                if (locationManagerDelegate) {
                                    locationManagerDelegate.removeSubDelegate(subD);
                                    locationManagerDelegate = null;
                                }
                                if (locationManager) {
                                    locationManager.delegate = null;
                                    locationManager = null;
                                }
                                const rStatus = getStatusFromCLAuthorizationStatus(status, type);
                                resolve(rStatus);
                                // } else {
                                // reject('kCLAuthorizationStatusNotDetermined');
                            }
                        }
                    };
                    locationManagerDelegate.addSubDelegate(subD);
                    try {
                        CLog(CLogTypes.info, 'NSPLocation requestAuthorization', type);
                        if (type === 'always') {
                            locationManager.requestAlwaysAuthorization();
                        } else {
                            locationManager.requestWhenInUseAuthorization();
                        }
                    } catch (e) {
                        reject(e);
                        if (locationManagerDelegate) {
                            locationManagerDelegate.removeSubDelegate(subD);
                            locationManagerDelegate = null;
                        }
                        if (locationManager) {
                            locationManager.delegate = null;
                            locationManager = null;
                        }
                    }
                });
            } else {
                // if (CLLocationManager.authorizationStatus() === CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedWhenInUse && type === 'always') {
                //     return Promise.resolve(Status.Denied);
                // } else {
                    return Promise.resolve(status);
                // }
            }
        }
    }
    namespace NSPBluetooth {
        let status: Status = Status.Undetermined;
        export function getStatus(): [Status, boolean] {
            const status2 = CBPeripheralManager.authorizationStatus();
            switch (status2) {
                case CBPeripheralManagerAuthorizationStatus.Authorized:
                    status = Status.Authorized;
                    break;
                case CBPeripheralManagerAuthorizationStatus.Denied:
                    status = Status.Denied;
                    break;
                case CBPeripheralManagerAuthorizationStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }
        export type SubCBPeripheralManagerDelegate = Partial<CBPeripheralManagerDelegate>;
        export class CBPeripheralManagerDelegateImpl extends NSObject implements CBPeripheralManagerDelegate {
            public static ObjCProtocols = [CBPeripheralManagerDelegate];

            private subDelegates: SubCBPeripheralManagerDelegate[];

            public addSubDelegate(delegate: SubCBPeripheralManagerDelegate) {
                const index = this.subDelegates.indexOf(delegate);
                if (index === -1) {
                    this.subDelegates.push(delegate);
                }
            }

            public removeSubDelegate(delegate: SubCBPeripheralManagerDelegate) {
                const index = this.subDelegates.indexOf(delegate);
                if (index !== -1) {
                    this.subDelegates.splice(index, 1);
                }
            }
            static new(): CBPeripheralManagerDelegateImpl {
                return super.new() as CBPeripheralManagerDelegateImpl;
            }
            public initDelegate(): CBPeripheralManagerDelegateImpl {
                this.subDelegates = [];
                return this;
            }
            peripheralManagerDidUpdateState(peripheralManager) {
                this.subDelegates.forEach(d => {
                    if (d.peripheralManagerDidUpdateState) {
                        d.peripheralManagerDidUpdateState(peripheralManager);
                    }
                });
            }
        }
        let peripheralManager: CBPeripheralManager;
        export function request(): Promise<[Status, boolean]> {
            const status = getStatus();
            if (status[0] === Status.Undetermined) {
                return new Promise((resolve, reject) => {
                    if (!peripheralManager) {
                        peripheralManager = CBPeripheralManager.new();
                        peripheralManager.delegate = CBPeripheralManagerDelegateImpl.new().initDelegate();
                    }
                    const subD = {
                        peripheralManagerDidUpdateState: peripheralManager => {
                            if (peripheralManager) {
                                peripheralManager.stopAdvertising();
                                (peripheralManager.delegate as CBPeripheralManagerDelegateImpl).removeSubDelegate(subD);
                                peripheralManager.delegate = null;
                                peripheralManager = null;
                            }
                            // for some reason, checking permission right away returns denied. need to wait a tiny bit
                            setTimeout(() => {
                                resolve(getStatus());
                            }, 100);
                        }
                    };
                    (peripheralManager.delegate as CBPeripheralManagerDelegateImpl).addSubDelegate(subD);
                    try {
                        peripheralManager.startAdvertising(null);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                return Promise.resolve(status);
            }
        }
    }
    namespace NSPAudioVideo {
        let status: Status = Status.Undetermined;
        function typeFromString(value: string) {
            if (value === 'audio') {
                return AVMediaTypeAudio;
            } else {
                return AVMediaTypeVideo;
            }
        }
        export function getStatus(type?: string): [Status, boolean] {
            const videoStatus = AVCaptureDevice.authorizationStatusForMediaType(typeFromString(type));
            switch (videoStatus) {
                case AVAuthorizationStatus.Authorized:
                    status = Status.Authorized;
                    break;
                case AVAuthorizationStatus.Denied:
                    status = Status.Denied;
                    break;
                case AVAuthorizationStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }

        export function request(type): Promise<[Status, boolean]> {
            return new Promise((resolve, reject) => {
                AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(typeFromString(type), granted => resolve(getStatus(type)));
            });
        }
    }
    namespace NSPSpeechRecognition {
        let status: Status = Status.Undetermined;
        export function getStatus(): [Status, boolean] {
            const speechStatus = SFSpeechRecognizer.authorizationStatus();
            switch (speechStatus) {
                case SFSpeechRecognizerAuthorizationStatus.Authorized:
                    status = Status.Authorized;
                    break;
                case SFSpeechRecognizerAuthorizationStatus.Denied:
                    status = Status.Denied;
                    break;
                case SFSpeechRecognizerAuthorizationStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }

        export function request(): Promise<[Status, boolean]> {
            return new Promise(resolve => {
                SFSpeechRecognizer.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPPhoto {
        let status: Status = Status.Undetermined;
        export function getStatus(): [Status, boolean] {
            const photoStatus = PHPhotoLibrary.authorizationStatus();
            switch (photoStatus) {
                case PHAuthorizationStatus.Authorized:
                    status = Status.Authorized;
                    break;
                case PHAuthorizationStatus.Denied:
                    status = Status.Denied;
                    break;
                case PHAuthorizationStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }

        export function request(): Promise<[Status, boolean]> {
            return new Promise(resolve => {
                PHPhotoLibrary.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPMotion {
        let status: Status = Status.Undetermined;
        export function getStatus(): [Status, boolean] {
            if (status === Status.Undetermined) {
                const cmStatus = (CMMotionActivityManager.authorizationStatus as any) as CMAuthorizationStatus;
                switch (cmStatus) {
                    case CMAuthorizationStatus.Authorized:
                        status = Status.Authorized;
                        break;
                    case CMAuthorizationStatus.Denied:
                        status = Status.Denied;
                        break;
                    case CMAuthorizationStatus.Restricted:
                        status = Status.Restricted;
                        break;
                }
            }
            return [status, true];
        }

        export function request(): Promise<[Status, boolean]> {
            if (status === Status.Undetermined) {
                return new Promise(resolve => {
                    let activityManager = CMMotionActivityManager.new();
                    let motionActivityQueue = NSOperationQueue.new();
                    CLog(CLogTypes.info, 'NSPMotion request', status);
                    activityManager.queryActivityStartingFromDateToDateToQueueWithHandler(NSDate.distantPast, new Date(), motionActivityQueue, (activities, error) => {
                        if (error) {
                            status = Status.Denied;
                        } else if (activities || !error) {
                            status = Status.Authorized;
                        }
                        CLog(CLogTypes.info, 'NSPMotion got response', activities, error, status, getStatus());
                        resolve([status, true]);
                        activityManager = null;
                        motionActivityQueue = null;
                    });
                });
            } else {
                return Promise.resolve([status, true]);
            }
        }
    }
    namespace NSPMediaLibrary {
        let status: Status = Status.Undetermined;
        export function getStatus(): [Status, boolean] {
            const mediaStatus = MPMediaLibrary.authorizationStatus();
            switch (mediaStatus) {
                case MPMediaLibraryAuthorizationStatus.Authorized:
                    status = Status.Authorized;
                    break;
                case MPMediaLibraryAuthorizationStatus.Denied:
                    status = Status.Denied;
                    break;
                case MPMediaLibraryAuthorizationStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }

        export function request(): Promise<[Status, boolean]> {
            return new Promise(resolve => {
                MPMediaLibrary.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPNotification {
        let status: Status = Status.Undetermined;
        const NSPDidAskForNotification = 'NSPDidAskForNotification';
        export function getStatus(): [Status, boolean] {
            const didAskForPermission = NSUserDefaults.standardUserDefaults.boolForKey(NSPDidAskForNotification);
            const isEnabled = UIApplication.sharedApplication.currentUserNotificationSettings.types !== UIUserNotificationType.None;

            if (isEnabled) {
                status = Status.Authorized;
            } else {
                status = didAskForPermission ? Status.Denied : Status.Undetermined;
            }
            return [status, true];
        }

        export function request(types: UIUserNotificationType): Promise<[Status, boolean]> {
            const status = getStatus();

            if (status[0] === Status.Undetermined) {
                return new Promise(resolve => {
                    const observer = function() {
                        resolve(getStatus());
                        NSNotificationCenter.defaultCenter.removeObserver(observer);
                    };
                    NSNotificationCenter.defaultCenter.addObserverForNameObjectQueueUsingBlock(UIApplicationDidBecomeActiveNotification, null, null, observer);

                    const settings = UIUserNotificationSettings.settingsForTypesCategories(types, null);
                    UIApplication.sharedApplication.registerUserNotificationSettings(settings);
                    UIApplication.sharedApplication.registerForRemoteNotifications();

                    NSUserDefaults.standardUserDefaults.setBoolForKey(true, NSPDidAskForNotification);
                    NSUserDefaults.standardUserDefaults.synchronize();
                });
            } else {
                return Promise.resolve(status);
            }
        }
    }
    namespace NSPContacts {
        let status: Status = Status.Undetermined;
        export function getStatus(): [Status, boolean] {
            const contactStatus = CNContactStore.authorizationStatusForEntityType(CNEntityType.Contacts);
            switch (contactStatus) {
                case CNAuthorizationStatus.Authorized:
                    status = Status.Authorized;
                    break;
                case CNAuthorizationStatus.Denied:
                    status = Status.Denied;
                    break;
                case CNAuthorizationStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }

        export function request(): Promise<[Status, boolean]> {
            return new Promise(resolve => {
                const contactStore = CNContactStore.new();
                contactStore.requestAccessForEntityTypeCompletionHandler(CNEntityType.Contacts, () => resolve(getStatus()));
            });
        }
    }
    namespace NSPBackgroundRefresh {
        let status: Status = Status.Undetermined;
        export function getStatus(): [Status, boolean] {
            const refreshStatus = UIApplication.sharedApplication.backgroundRefreshStatus;
            switch (refreshStatus) {
                case UIBackgroundRefreshStatus.Available:
                    status = Status.Authorized;
                    break;
                case UIBackgroundRefreshStatus.Denied:
                    status = Status.Denied;
                    break;
                case UIBackgroundRefreshStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }

        export function request(): Promise<Status> {
            return new Promise(resolve => {
                const contactStore = CNContactStore.new();
                contactStore.requestAccessForEntityTypeCompletionHandler(CNEntityType.Contacts, () => resolve(getStatus()[0]));
            });
        }
    }
    namespace NSPEvent {
        let status: Status = Status.Undetermined;
        function typeFromString(value: string) {
            if (value === 'reminder') {
                return EKEntityType.Reminder;
            } else {
                return EKEntityType.Event;
            }
        }
        export function getStatus(type?: string): [Status, boolean] {
            const eventStatus = EKEventStore.authorizationStatusForEntityType(typeFromString(type));
            switch (eventStatus) {
                case EKAuthorizationStatus.Authorized:
                    status = Status.Authorized;
                    break;
                case EKAuthorizationStatus.Denied:
                    status = Status.Denied;
                    break;
                case EKAuthorizationStatus.Restricted:
                    status = Status.Restricted;
                    break;
                default:
                    status = Status.Undetermined;
            }
            return [status, true];
        }

        export function request(type?: string): Promise<[Status, boolean]> {
            return new Promise(resolve => {
                const aStore = EKEventStore.new();
                aStore.requestAccessToEntityTypeCompletion(typeFromString(type), () => resolve(getStatus(type)));
            });
        }
    }

    export enum NSType {
        Unknown,
        Location = 'location',
        Camera = 'camera',
        Microphone = 'microphone',
        Photo = 'photo',
        Contacts = 'contacts',
        Event = 'event',
        Reminder = 'reminder',
        Bluetooth = 'bluetooth',
        Notification = 'notification',
        BackgroundRefresh = 'backgroundRefresh',
        NSPTypeSpeechRecognition = 'speechRecognition',
        MediaLibrary = 'mediaLibrary',
        Motion = 'motion'
    }

    export function openSettings() {
        return new Promise((resolve, reject) => {
            const center = NSNotificationCenter.defaultCenter;
            const observer = function(notif) {
                resolve(true);
                center.removeObserver(observer);
            };
            center.addObserverForNameObjectQueueUsingBlock(UIApplicationDidBecomeActiveNotification, null, null, observer);
            UIApplication.sharedApplication.openURL(NSURL.URLWithString(UIApplicationOpenSettingsURLString));
        });
    }
    export function canOpenSettings() {
        return Promise.resolve(UIApplicationOpenSettingsURLString !== null);
    }
    export function getPermissionStatus(type, json): Promise<[Status, boolean]> {
        let status: [Status, boolean];
        CLog(CLogTypes.info, `nativescript-perms: getPermissionStatus ${type} ${json}`);

        switch (type) {
            case NSType.Location: {
                // NSString *locationPermissionType = [RCTConvert NSString:json];
                status = NSPLocation.getStatusForType(json);
                break;
            }
            case NSType.Camera:
                status = NSPAudioVideo.getStatus('video');
                break;
            case NSType.Microphone:
                status = NSPAudioVideo.getStatus('audio');
                break;
            case NSType.Photo:
                status = NSPPhoto.getStatus();
                break;
            case NSType.Contacts:
                status = NSPContacts.getStatus();
                break;
            case NSType.Event:
                status = NSPEvent.getStatus('event');
                break;
            case NSType.Reminder:
                status = NSPEvent.getStatus('reminder');
                break;
            case NSType.Bluetooth:
                status = NSPBluetooth.getStatus();
                break;
            case NSType.Notification:
                status = NSPNotification.getStatus();
                break;
            case NSType.BackgroundRefresh:
                status = NSPBackgroundRefresh.getStatus();
                break;
            case NSType.NSPTypeSpeechRecognition:
                status = NSPSpeechRecognition.getStatus();
                break;
            case NSType.MediaLibrary:
                status = NSPMediaLibrary.getStatus();
                break;
            case NSType.Motion:
                status = NSPMotion.getStatus();
                break;
            default:
                break;
        }

        return Promise.resolve(status);
    }
    export function requestPermission(type, json): Promise<[Status, boolean]> {
        CLog(CLogTypes.info, `nativescript-perms: requestPermission ${type} ${json}`);
        switch (type) {
            case NSType.Location:
                return NSPLocation.request(json);
            case NSType.Camera:
                return NSPAudioVideo.request('video');
            case NSType.Microphone:
                return NSPAudioVideo.request('audio');
            case NSType.Photo:
                return NSPPhoto.request();
            case NSType.Contacts:
                return NSPContacts.request();
            case NSType.Event:
                return NSPEvent.request('event');
            case NSType.Reminder:
                return NSPEvent.request('reminder');
            case NSType.Bluetooth:
                return NSPBluetooth.request();
            case NSType.Notification:
                let types: UIUserNotificationType;
                const typeStrings: string[] = json;
                if (typeStrings.indexOf('alert') !== -1) {
                    types = types | UIUserNotificationType.Alert;
                }
                if (typeStrings.indexOf('badge') !== -1) {
                    types = types | UIUserNotificationType.Badge;
                }
                if (typeStrings.indexOf('sound') !== -1) {
                    types = types | UIUserNotificationType.Sound;
                }
                return NSPNotification.request(types);
            case NSType.NSPTypeSpeechRecognition:
                return NSPSpeechRecognition.request();
            case NSType.MediaLibrary:
                return NSPMediaLibrary.request();
            case NSType.Motion:
                return NSPMotion.request();
            default:
                return Promise.reject(NSType.Unknown);
        }
    }
}

const DEFAULTS = {
    location: 'whenInUse',
    notification: ['alert', 'badge', 'sound']
};

const permissionTypes = Object.keys(PermissionsIOS.NSType).map(k => PermissionsIOS.NSType[k]) as string[];

export function canOpenSettings() {
    return PermissionsIOS.canOpenSettings();
}

export function openSettings() {
    return PermissionsIOS.openSettings();
}

export function getTypes() {
    return permissionTypes;
}

export function check(permission: string, options?: CheckOptions): Promise<[PermissionsIOS.Status, boolean]> {
    CLog(CLogTypes.info, `nativescript-perms: check ${permission} ${options}`);
    if (permissionTypes.indexOf(permission) === -1) {
        // const error = new Error(`ReactNativePermissions: ${permission} is not a valid permission type on iOS`);

        // return Promise.reject(error);
        CLog(CLogTypes.warning, `nativescript-perms: ${permission} is not a valid permission type on iOS`);
        // const error = new Error(`nativescript-perms: ${permission} is not a valid permission type on Android`);

        return Promise.resolve([PermissionsIOS.Status.Authorized, true]);
    }

    let type;

    if (typeof options === 'string') {
        type = options;
    } else if (options && options.type) {
        type = options.type;
    }

    return PermissionsIOS.getPermissionStatus(permission, type || DEFAULTS[permission]);
}

export function request(permission: string, options?: RequestOptions): Promise<[PermissionsIOS.Status, boolean]> {
    CLog(CLogTypes.info, `nativescript-perms: request ${permission} ${options}`);
    if (permissionTypes.indexOf(permission) === -1) {
        // const error = new Error(`ReactNativePermissions: ${permission} is not a valid permission type on iOS`);
        CLog(CLogTypes.warning, `nativescript-perms: ${permission} is not a valid permission type on iOS`);

        return Promise.resolve([PermissionsIOS.Status.Authorized, true]);
    }

    if (permission === 'backgroundRefresh') {
        const error = new Error('nativescript-perms: You cannot request backgroundRefresh');

        return Promise.reject(error);
    }

    let type;

    if (typeof options === 'string') {
        type = options;
    } else if (options && options.type) {
        type = options.type;
    }

    return PermissionsIOS.requestPermission(permission, type || DEFAULTS[permission]);
}

export function checkMultiple(permissions: string[]) {
    return Promise.all(permissions.map(permission => this.check(permission))).then(result =>
        result.reduce((acc, value, index) => {
            const name = permissions[index];
            acc[name] = value;
            return acc;
        }, {})
    );
}
