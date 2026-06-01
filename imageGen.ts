// ===================================================================
// PUSH NOTIFICATIONS — Frontend service
// ===================================================================

import { trpc } from "@/providers/trpc";

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  } catch (e) {
    console.error("SW registration failed:", e);
    return null;
  }
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;

  // Get VAPID public key from backend
  const utils = trpc.useUtils();
  const keyData = await utils.push.vapidKey.fetch();
  if (!keyData?.publicKey) return null;

  const registration = await navigator.serviceWorker.ready;
  const existingSub = await registration.pushManager.getSubscription();
  if (existingSub) return existingSub;

  // Convert VAPID key to Uint8Array
  const vapidKey = urlBase64ToUint8Array(keyData.publicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidKey,
  });

  return subscription;
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  const registration = await navigator.serviceWorker.ready;
  const sub = await registration.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    return true;
  }
  return false;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  return Notification.requestPermission();
}

export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

// Utility: Convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
