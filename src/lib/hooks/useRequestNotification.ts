import { useEffect } from "react";
import { toast } from "sonner";

export const useRequestNotification = () => {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === "denied") {
        toast.info("Please accept notification request for full feature");
      }
    });
  }, []);
};
