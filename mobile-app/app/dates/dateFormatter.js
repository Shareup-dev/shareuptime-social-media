import moment from "moment";

const calendarFormatter = (day, month, year, hour, minute, second) => {
  let date = new Date();
  date.setDate(day);
  date.setMonth(month - 1);
  date.setFullYear(year);
  date.setUTCHours(hour);
  date.setUTCMinutes(minute);
  date.setUTCSeconds(second);

  const splitResult = moment(date).calendar().split("at");
  let formattedDate = "";

  if (splitResult[0].search("Today") === 0) {
    formattedDate = splitResult[1];
  } else if (splitResult[0].search("Last") === 0) {
    const secondSplit = splitResult[0].split(" ");
    formattedDate = secondSplit[1];
  } else {
    formattedDate = splitResult[0];
  }

  return formattedDate.trim();
};

export default {
  calendarFormatter,
};
