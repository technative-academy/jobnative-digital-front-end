export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function formatDate(date) {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'long' });
  const year = d.getFullYear();

  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${getOrdinal(day)} ${month} ${year}, ${hours}:${minutes}`;
}

export function stringArrayToString(arr) {
  // Return empty string for non-arrays or empty arrays
  if (!Array.isArray(arr) || arr.length === 0) return "";

  let str = "";
  arr.forEach(element => {
    str += element.trim() + ", "
  });
  return str.slice(0, -2);
}