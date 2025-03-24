export function formatTimeAgo(timestampMs) {
  const timestampS = timestampMs / 1000;
  const currentTimeS = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeDiffS = currentTimeS - timestampS;

  if (timeDiffS < 60) {
    return "just now";
  } else if (timeDiffS < 3600) {
    const minutes = Math.floor(timeDiffS / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDiffS < 86400) {
    const hours = Math.floor(timeDiffS / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (timeDiffS < 2592000) {
    // Less than 30 days
    const days = Math.floor(timeDiffS / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (timeDiffS < 31536000) {
    //less than 1 year
    const months = Math.floor(timeDiffS / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(timeDiffS / 31536000);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}
