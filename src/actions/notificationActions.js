import Notifications from 'react-notification-system-redux';


export const success = data => Notifications.success(data.notification);
export const successMessage = data => Notifications.success({
  title: data,
  position: 'br'
});

export const error = data => Notifications.error(data.notification);