export default function formatDate(date: Date): string {
  const year = date.getFullYear();
  let month = `${date.getMonth() + 1}`; // JS month is 0 indexed
  let day = `${date.getDate()}`;

  if (month.length === 1) {
    month = `0${month}`;
  }

  if (day.length === 1) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
}
