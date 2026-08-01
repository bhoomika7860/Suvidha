import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

const VAPID_KEY =
  "BDBn2pD9JERpEvsi9UiY1JArecTCQvF6kUEqQfWVjy6giSkef5svG7TWKn5OXwzX79PCaiMajwuQKzr5bTzaYCow";

export async function registerForPushNotifications() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    console.log("FCM TOKEN:", token);

    return token;
  } catch (err) {
    console.error("FCM Error:", err);
    return null;
  }
}