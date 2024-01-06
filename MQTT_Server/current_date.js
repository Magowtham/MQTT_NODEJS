const currentDate = () => {
  const now = new Date();
  const time = `${(now.getHours() % 12 || 12).toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  return {
    date: now,
    time,
    indDate: `${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}   ${time}`,
  };
};
module.exports = currentDate;
