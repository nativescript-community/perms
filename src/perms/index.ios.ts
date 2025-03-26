import { Application, Device, Trace, Utils } from '@nativescript/core';
import { CheckOptions, LocationOptions, MultiResult, PermissionOptions, RequestOptions, Result } from '.';
import { CLog, CLogTypes, Status } from './index.common';
export * from './index.common';

export namespace PermissionsIOS {
    namespace NSPLocation {
        let status: Status = Status.Undetermined;
        function getStatusFromCLAuthorizationStatus(lStatus: CLAuthorizationStatus, type?: string): Status {
            switch (lStatus) {
                case CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedAlways:
                    status = Status.Authorized;
                    break;
                case CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedWhenInUse:
                    // if (type === 'always') {
                    //     status = Status.Denied;
                    // } else {
                    status = Status.Authorized;
                    // }
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
            if (Trace.isEnabled()) {
                CLog(CLogTypes.info, 'NSPLocation getStatusFromCLAuthorizationStatus', lStatus, type, status);
            }
            return status;
        }
        export function getStatusForType(type?: string): Status {
            const status = CLLocationManager.authorizationStatus();
            return getStatusFromCLAuthorizationStatus(status, type);
        }
        export function getStatus(options?: LocationOptions): Status {
            const type = getTypeFromOptions(options);
            return getStatusForType(type);
        }
        let locationManager: CLLocationManager;
        let locationManagerDelegate: CLLocationManagerDelegateImpl;
        type SubCLLocationManagerDelegate = Partial<CLLocationManagerDelegate>;
        @NativeClass
        class CLLocationManagerDelegateImpl extends NSObject implements CLLocationManagerDelegate {
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
            locationManagerDidChangeAuthorizationStatus(manager: CLLocationManager, status: CLAuthorizationStatus) {
                this.subDelegates &&
                    this.subDelegates.forEach((d) => {
                        if (d.locationManagerDidChangeAuthorizationStatus) {
                            d.locationManagerDidChangeAuthorizationStatus(manager, status);
                        }
                    });
            }
            // locationManagerDidFailWithError(manager: CLLocationManager, error: NSError) {
            //     this.subDelegates &&
            //         this.subDelegates.forEach(d => {
            //             if (d.locationManagerDidFailWithError) {
            //                 d.locationManagerDidFailWithError(manager, error);
            //             }
            //         });
            // }
        }

        function getTypeFromOptions(options?: LocationOptions) {
            return options?.background === true ? 'always' : 'whenInUse';
        }
        export async function request(options?: LocationOptions): Promise<Status> {
            const type = getTypeFromOptions(options);
            const status = getStatusForType(type);
            if (Trace.isEnabled()) {
                CLog(CLogTypes.info, 'NSPLocation request', type, status);
            }
            if (status === Status.Undetermined || status === Status.Denied) {
                return new Promise((resolve, reject) => {
                    if (!locationManager) {
                        locationManager = CLLocationManager.new();
                    }
                    if (!locationManagerDelegate) {
                        locationManagerDelegate = CLLocationManagerDelegateImpl.new().initDelegate();
                        locationManager.delegate = locationManagerDelegate;
                    }
                    if (Trace.isEnabled()) {
                        CLog(CLogTypes.info, 'NSPLocation requesting location', locationManager, locationManagerDelegate);
                    }
                    function cleanup() {
                        if (locationManagerDelegate) {
                            locationManagerDelegate.removeSubDelegate(subD);
                            locationManagerDelegate = null;
                        }
                        if (locationManager) {
                            locationManager.delegate = null;
                            // locationManager = null;
                        }
                    }
                    const subD = {
                        locationManagerDidChangeAuthorizationStatus: (manager, status: CLAuthorizationStatus) => {
                            if (Trace.isEnabled()) {
                                CLog(CLogTypes.info, 'locationManagerDidChangeAuthorizationStatus', status);
                            }
                            if (status !== CLAuthorizationStatus.kCLAuthorizationStatusNotDetermined) {
                                const rStatus = getStatusFromCLAuthorizationStatus(status, type);
                                resolve(rStatus);
                                cleanup();
                            }
                        }
                    };
                    locationManagerDelegate.addSubDelegate(subD);
                    try {
                        if (Trace.isEnabled()) {
                            CLog(CLogTypes.info, 'NSPLocation requestAuthorization', type);
                        }
                        if (type === 'always') {
                            locationManager.requestAlwaysAuthorization();
                        } else {
                            locationManager.requestWhenInUseAuthorization();
                        }
                    } catch (e) {
                        reject(e);
                        cleanup();
                    }
                });
            } else {
                return status;
            }
        }
    }
    namespace NSPBluetooth {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
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
            return status;
        }
        type SubCBPeripheralManagerDelegate = Partial<CBPeripheralManagerDelegate>;
        @NativeClass
        class CBPeripheralManagerDelegateImpl extends NSObject implements CBPeripheralManagerDelegate {
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
                this.subDelegates.forEach((d) => {
                    if (d.peripheralManagerDidUpdateState) {
                        d.peripheralManagerDidUpdateState(peripheralManager);
                    }
                });
            }
        }
        let peripheralManager: CBPeripheralManager;
        export function request(): Promise<Status> {
            const status = getStatus();
            if (status === Status.Undetermined || status === Status.Denied) {
                return new Promise((resolve, reject) => {
                    if (!peripheralManager) {
                        peripheralManager = CBPeripheralManager.new();
                        peripheralManager.delegate = CBPeripheralManagerDelegateImpl.new().initDelegate();
                    }
                    const subD = {
                        peripheralManagerDidUpdateState: (peripheralManager) => {
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
        export function getStatus(type?: string): Status {
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
            return status;
        }

        export function request(type): Promise<Status> {
            return new Promise((resolve, reject) => {
                AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(typeFromString(type), (granted) => resolve(getStatus(type)));
            });
        }
    }
    namespace NSPSpeechRecognition {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
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
            return status;
        }

        export function request(): Promise<Status> {
            return new Promise((resolve) => {
                SFSpeechRecognizer.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPPhoto {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
            let photoStatus: PHAuthorizationStatus;
            if (parseFloat(Device.osVersion) >= 14) {
                photoStatus = PHPhotoLibrary.authorizationStatusForAccessLevel(PHAccessLevel.ReadWrite);
            } else {
                photoStatus = PHPhotoLibrary.authorizationStatus();
            }
            switch (photoStatus) {
                case PHAuthorizationStatus.Limited:
                    status = Status.Limited;
                    break;
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
            return status;
        }

        export function request(): Promise<Status> {
            return new Promise((resolve) => {
                PHPhotoLibrary.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPMotion {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
            if (status === Status.Undetermined) {
                const cmStatus = CMMotionActivityManager.authorizationStatus();
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
            return status;
        }

        export async function request(): Promise<Status> {
            const status = getStatus();

            if (status === Status.Undetermined || status === Status.Denied) {
                await new Promise<void>((resolve, reject) => {
                    let activityManager = CMMotionActivityManager.new();
                    let motionActivityQueue = NSOperationQueue.new();
                    if (Trace.isEnabled()) {
                        CLog(CLogTypes.info, 'NSPMotion request', status);
                    }
                    activityManager.queryActivityStartingFromDateToDateToQueueWithHandler(NSDate.distantPast, new Date(), motionActivityQueue, (activities, error) => {
                        if (Trace.isEnabled()) {
                            CLog(CLogTypes.info, 'NSPMotion got response', activities, error, status, getStatus());
                        }
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                        activityManager = null;
                        motionActivityQueue = null;
                    });
                });
                return getStatus();
            } else {
                return status;
            }
        }
    }
    namespace NSPMediaLibrary {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
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
            return status;
        }

        export function request(): Promise<Status> {
            return new Promise((resolve) => {
                MPMediaLibrary.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPNotification {
        let status: Status = Status.Undetermined;
        const NSPDidAskForNotification = 'NSPDidAskForNotification';
        export async function getStatus(): Promise<Status> {
            const didAskForPermission = NSUserDefaults.standardUserDefaults.boolForKey(NSPDidAskForNotification);
            let isEnabled = false;
            const osVersion = parseFloat(Device.osVersion);
            if (osVersion >= 10) {
                const test = await new Promise<UNNotificationSettings>((resolve) => UNUserNotificationCenter.currentNotificationCenter().getNotificationSettingsWithCompletionHandler(resolve));
                isEnabled = test.authorizationStatus === UNAuthorizationStatus.Authorized;
            } else {
                isEnabled = UIApplication.sharedApplication.currentUserNotificationSettings.types !== UIUserNotificationType.None;
            }

            if (isEnabled) {
                status = Status.Authorized;
            } else {
                status = didAskForPermission ? Status.Denied : Status.Undetermined;
            }
            return status;
        }

        export async function request(types: UIUserNotificationType | UNAuthorizationOptions = UNAuthorizationOptions.Alert): Promise<Status> {
            const status = await getStatus();

            if (status === Status.Undetermined || status === Status.Denied) {
                await new Promise<void>((resolve, reject) => {
                    Utils.dispatchToMainThread(() => {
                        const osVersion = parseFloat(Device.osVersion);
                        if (osVersion >= 10) {
                            UNUserNotificationCenter.currentNotificationCenter().requestAuthorizationWithOptionsCompletionHandler(types as UNAuthorizationOptions, (p1: boolean, error: NSError) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    UIApplication.sharedApplication.registerForRemoteNotifications();
                                    resolve();
                                }
                            });
                        } else {
                            const settings = UIUserNotificationSettings.settingsForTypesCategories(types as UIUserNotificationType, null);
                            UIApplication.sharedApplication.registerUserNotificationSettings(settings);
                            UIApplication.sharedApplication.registerForRemoteNotifications();
                            resolve();
                        }
                    });
                });
                NSUserDefaults.standardUserDefaults.setBoolForKey(true, NSPDidAskForNotification);
                NSUserDefaults.standardUserDefaults.synchronize();
                return getStatus();
            } else {
                return status;
            }
        }
    }
    namespace NSPContacts {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
            const contactStatus = CNContactStore.authorizationStatusForEntityType(CNEntityType.Contacts);
            switch (contactStatus) {
                case CNAuthorizationStatus.Limited:
                    status = Status.Limited;
                    break;
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
            return status;
        }

        export function request(): Promise<Status> {
            return new Promise((resolve) => {
                const contactStore = CNContactStore.new();
                contactStore.requestAccessForEntityTypeCompletionHandler(CNEntityType.Contacts, () => resolve(getStatus()));
            });
        }
    }
    namespace NSPBackgroundRefresh {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
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
            return status;
        }

        export function request(): Promise<Status> {
            return new Promise((resolve) => {
                const contactStore = CNContactStore.new();
                contactStore.requestAccessForEntityTypeCompletionHandler(CNEntityType.Contacts, () => resolve(getStatus()));
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
        export function getStatus(type?: string): Status {
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
            return status;
        }

        export function request(type?: string): Promise<Status> {
            return new Promise((resolve) => {
                const aStore = EKEventStore.new();
                aStore.requestAccessToEntityTypeCompletion(typeFromString(type), () => resolve(getStatus(type)));
            });
        }
    }

    export enum NSType {
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
        return new Promise(async (resolve, reject) => {
            if (!(await canOpenSettings())) {
                reject(new Error('cant_open_settings'));
            }
            let timeoutHandler;
            function onActive(notif) {
                resolve(true);
                Application.ios.removeNotificationObserver(observer, UIApplicationDidBecomeActiveNotification);
                if (timeoutHandler) {
                    clearTimeout(timeoutHandler);
                    timeoutHandler = null;
                }
            }
            function onResignActive(notif) {
                Application.ios.removeNotificationObserver(observer1, UIApplicationWillResignActiveNotification);
                if (timeoutHandler) {
                    clearTimeout(timeoutHandler);
                    timeoutHandler = null;
                }
            }

            const observer = Application.ios.addNotificationObserver(UIApplicationDidBecomeActiveNotification, onActive);
            const observer1 = Application.ios.addNotificationObserver(UIApplicationWillResignActiveNotification, onResignActive);
            UIApplication.sharedApplication.openURLOptionsCompletionHandler(NSURL.URLWithString(UIApplicationOpenSettingsURLString), null, null);
            timeoutHandler = setTimeout(() => {
                Application.ios.removeNotificationObserver(observer, UIApplicationDidBecomeActiveNotification);
                Application.ios.removeNotificationObserver(observer1, UIApplicationWillResignActiveNotification);
                timeoutHandler = null;
                // something did not work let s cancel
                reject(new Error('cant_open_settings'));
            }, 1000);
        });
    }
    export async function canOpenSettings() {
        return !!UIApplicationOpenSettingsURLString;
    }
    export async function getPermissionStatus(type, json): Promise<Status> {
        let status: Status;
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'getPermissionStatus', type, json);
        }

        switch (type) {
            case NSType.Location: {
                status = NSPLocation.getStatus(json);
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
                status = await NSPNotification.getStatus();
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

        return status;
    }
    export function requestPermission(perm, options): Promise<Status> {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'requestPermission', perm, options);
        }
        switch (perm) {
            case NSType.Location:
                return NSPLocation.request(options);
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
                let types: number;
                const typeStrings: string[] = options;
                const osVersion = parseFloat(Device.osVersion);
                if (osVersion >= 10) {
                    if (typeStrings.indexOf('alert') !== -1) {
                        types = types | UNAuthorizationOptions.Alert;
                    }
                    if (typeStrings.indexOf('badge') !== -1) {
                        types = types | UNAuthorizationOptions.Badge;
                    }
                    if (typeStrings.indexOf('sound') !== -1) {
                        types = types | UNAuthorizationOptions.Sound;
                    }
                    if (typeStrings.indexOf('carPlay') !== -1) {
                        types = types | UNAuthorizationOptions.CarPlay;
                    }
                    if (osVersion >= 12) {
                        if (typeStrings.indexOf('providesAppNotificationSettings') !== -1) {
                            types = types | UNAuthorizationOptions.ProvidesAppNotificationSettings;
                        }
                        if (typeStrings.indexOf('criticalAlert') !== -1) {
                            types = types | UNAuthorizationOptions.CriticalAlert;
                        }
                        if (typeStrings.indexOf('provisional') !== -1) {
                            types = types | UNAuthorizationOptions.Provisional;
                        }

                        if (osVersion >= 13 && osVersion <= 15) {
                            if (typeStrings.indexOf('annoucement') !== -1) {
                                types = types | UNAuthorizationOptions.Announcement;
                            }
                            if (typeStrings.indexOf('timeSensitive') !== -1) {
                                types = types | UNAuthorizationOptions.TimeSensitive;
                            }
                        }
                    }
                } else {
                    if (typeStrings.indexOf('alert') !== -1) {
                        types = types | UIUserNotificationType.Alert;
                    }
                    if (typeStrings.indexOf('badge') !== -1) {
                        types = types | UIUserNotificationType.Badge;
                    }
                    if (typeStrings.indexOf('sound') !== -1) {
                        types = types | UIUserNotificationType.Sound;
                    }
                }

                return NSPNotification.request(types);
            case NSType.NSPTypeSpeechRecognition:
                return NSPSpeechRecognition.request();
            case NSType.MediaLibrary:
                return NSPMediaLibrary.request();
            case NSType.Motion:
                return NSPMotion.request();
            default:
                return Promise.reject('unknown');
        }
    }
}

const DEFAULTS = {
    notification: ['alert', 'badge', 'sound']
} as {
    [key in IOSPermissionTypes]: any;
};

type IOSPermissionTypes = `${PermissionsIOS.NSType}`;
type ObjectIOSPermissionsRest = {
    [key in IOSPermissionTypes]: PermissionOptions;
};
const permissionTypes = Object.values(PermissionsIOS.NSType) as IOSPermissionTypes[];

export function canOpenSettings() {
    return PermissionsIOS.canOpenSettings();
}

export function openSettings() {
    return PermissionsIOS.openSettings();
}

export function openNotificationSettings() {
    return PermissionsIOS.canOpenSettings();
}

export function getTypes() {
    return permissionTypes;
}

export async function check(permission: IOSPermissionTypes, options?: CheckOptions): Promise<Status> {
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'check', permission, options);
    }
    if (permissionTypes.indexOf(permission) === -1) {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.warning, permission, 'is not a valid permission type on iOS');
        }

        return Status.Authorized;
    }

    let type;

    return PermissionsIOS.getPermissionStatus(permission, options || DEFAULTS[permission]);
}

export async function request<T extends IOSPermissionTypes | Record<IOSPermissionTypes, any>>(permission: T, options?: RequestOptions): Promise<Result<T>> {
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'request', permission, options);
    }
    if (typeof permission === 'object') {
        const grantedPermissions: Result<IOSPermissionTypes[]> = {};
        const keys = Object.keys(permission) as IOSPermissionTypes[];

        for (let index = 0; index < keys.length; index++) {
            const perm = keys[index];
            const res = await request(perm, permission[perm]);
            grantedPermissions[perm] = res;
        }
        return grantedPermissions;
    }
    if (permissionTypes.indexOf(permission) === -1) {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.warning, permission, 'is not a valid permission type on iOS');
        }

        return Status.Authorized as any;
    }

    if (permission === 'backgroundRefresh') {
        throw new Error('@nativescript-community/perms: You cannot request backgroundRefresh');
    }

    return PermissionsIOS.requestPermission(permission, options || DEFAULTS[permission as IOSPermissionTypes]);
}

export function checkMultiple<T extends Partial<ObjectIOSPermissionsRest>>(permissions: T): Promise<MultiResult> {
    if (Trace.isEnabled()) {
        CLog(CLogTypes.info, 'checkMultiple', permissions);
    }
    return Promise.all(Object.keys(permissions).map((permission) => check(permission as any, permissions[permission]).then((r) => [permission, r]))).then((result) =>
        result.reduce((acc, value: [string, Status], index) => {
            acc[value[0]] = value[1];
            return acc;
        }, {} as MultiResult)
    );
}
