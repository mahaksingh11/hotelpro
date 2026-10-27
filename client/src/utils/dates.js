const pad = (n) => String(n).padStart(2, "0");

// Today's date as "YYYY-MM-DD" (used to block past dates)
export const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Show a date as "DD-MM-YYYY", like the expected screenshots
export const formatDate = (date) => {
  const d = new Date(date);
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
};

// Number of days, counting both start and end day (same as the backend)
export const countDays = (from, to) =>
  Math.round((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;