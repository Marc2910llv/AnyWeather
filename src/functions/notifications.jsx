import {toast} from 'react-hot-toast'
import {messaging} from '../firebase/firebase'
import { onMessage } from 'firebase/messaging';

// Lógica para mostrar el mensaje de notificación
onMessage(messaging, payload => {
    console.log("mensaje enviado");
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