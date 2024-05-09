import {toast} from 'react-hot-toast'

//Import firebase functions
import {messaging} from '../firebase/firebase'
import { onMessage } from 'firebase/messaging';

// Shows the notification with a toast if it is recieved on foreground
onMessage(messaging, payload => {
    toast(() => (
      <div className="notification-toast">
        <div className="notification-content">
          <div className="notification-header">{payload.notification.title}</div>
          <div className="notification-body">{payload.notification.body}</div>
          </div>
        <img className="notification-icon" src={payload.notification.image} alt="Notification Image" />
      </div>
    ),{
        position: "top-left"
    })
  });