import Notifications from 'react-notification-system-redux';


export const success = data => Notifications.success(data.notification);
export const error = data => Notifications.error(data.notification);