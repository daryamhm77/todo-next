function displayName(data) {
  const full = [data?.name, data?.lastName].filter(Boolean).join(" ").trim();
  return full || data?.email || "Profile";
}

export { displayName };
