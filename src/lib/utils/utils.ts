export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const requestNotification: () => Promise<
  NotificationPermission | undefined
> = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    return await Notification.requestPermission();
  }
};

export const createNotification = (
  title: string,
  options?: NotificationOptions,
) => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, options);
  notification.addEventListener("click", () => {
    window.focus();
    notification.close();
  });

  return notification;
};
