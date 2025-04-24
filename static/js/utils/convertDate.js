export const convertTime = (time) => {
  const currentTime = new Date().getTime();
  const differenceInSeconds = Math.floor((currentTime - time) / 1000);
  if (differenceInSeconds < 60) return `${differenceInSeconds} seconds ago`;
  const minutes = Math.floor(differenceInSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};
