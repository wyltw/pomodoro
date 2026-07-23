import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

export function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
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

export const playNotifySound = async (soundPath: string, volume = 0.35) => {
  const sound = new Audio(soundPath);
  sound.volume = Math.min(1, Math.max(0, volume));

  try {
    await sound.play();
  } catch {
    // Audio feedback is optional; ignore playback failures.
  }
};

type NotifyUserConfig = NotificationOptions & {
  volume?: number;
};

export const notifyUser = async (
  title: string,
  soundPath: string,
  config: NotifyUserConfig = {},
) => {
  const { volume, ...notificationOptions } = config;
  const isAppActive =
    document.visibilityState === "visible" && document.hasFocus();

  if (isAppActive) {
    await playNotifySound(soundPath, volume);
    return;
  }

  createNotification(title, notificationOptions);
};

export function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "?";
}

export const getLocalDateFromTimeZone = (
  timeZone: string,
  date = new Date(),
) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
};

dayjs.extend(utc);
dayjs.extend(timezone);

export const getLastSevenDays = (localDate: string, timeZone: string) => {
  const endDate = dayjs.tz(localDate, timeZone);

  return Array.from({ length: 7 }, (_, index) =>
    endDate.subtract(6 - index, "day").format("YYYY-MM-DD"),
  );
};
