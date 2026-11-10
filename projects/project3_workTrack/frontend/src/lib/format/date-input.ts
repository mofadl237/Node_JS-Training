export const toDateInputValue = (value: string): string => value.slice(0, 10);

export const toTimeInputValue = (value: string | null): string => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const toIsoDateValue = (value: string): string =>
  `${value}T00:00:00.000Z`;

export const combineDateAndTime = (
  date: string,
  time: string,
): string | null => {
  if (!time) return null;

  const value = new Date(`${date}T${time}:00`);

  return Number.isNaN(value.getTime()) ? null : value.toISOString();
};

export const getTodayDateInputValue = (): string => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};
