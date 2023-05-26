/* eslint-disable no-restricted-globals */
// Import the functions you need from the SDKs you need
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const messaging = getMessaging(firebase);

const requestPermission = async () => {
  /* console.log("권한 요청 중...");

  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
  }
  if (permission === "granted") {
    console.log("알림 권한 허용");
  } */

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  });

  if (token) {
    console.log("token: ", token);
  } else {
    console.log("Can not get Token");
  }

  onMessage(messaging, (payload) => {
    console.log("메시지가 도착했습니다.", payload);
    // ...
  });

  return { token };
};

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}

const askNotificationPermission = () => {
  // 권한을 실제로 요구하는 함수
  const handlePermission = (permission) => {
    // 사용자의 응답에 관계 없이 크롬이 정보를 저장할 수 있도록 함
    if (!("permission" in Notification)) {
      Notification.permission = permission;
    }
    console.log(Notification.permission);
    // 사용자 응답에 따라 단추를 보이거나 숨기도록 설정
    if (
      Notification.permission === "denied" ||
      Notification.permission === "default"
    ) {
      //notificationBtn.style.display = "block";
    } else {
      //notificationBtn.style.display = "none";
    }
  };

  // 브라우저가 알림을 지원하는지 확인
  if (!("Notification" in window)) {
    console.log("이 브라우저는 알림을 지원하지 않습니다.");
  } else {
    if (checkNotificationPromise()) {
      Notification.requestPermission().then((permission) => {
        handlePermission(permission);
      });
    } else {
      Notification.requestPermission(function (permission) {
        handlePermission(permission);
      });
    }
  }
};

export { requestPermission, askNotificationPermission };
