function capitalize(string) {
  const firstChar = string.charAt(0).toUpperCase();
  const rest = string.split("").slice(1).join("");
  return firstChar + rest;
}

export default capitalize;
