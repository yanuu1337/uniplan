import dayjs from "dayjs";

type GetOccurencesProps = {
  startDate: Date;
  endDate: Date;
  weekday: number;
  startTime: Date;
  endTime: Date;
};

export const getOccurencesInDateRange = ({
  startDate,
  endDate,
  weekday,
  startTime,
  endTime,
}: GetOccurencesProps) => {
  const rangeStart = dayjs(startDate).startOf("day");
  const rangeEnd = dayjs(endDate).endOf("day");
  const targetWeekday = weekday; // 0-6, Sunday-Saturday

  const timeStart = dayjs(startTime);
  const timeEnd = dayjs(endTime);

  // Find the first date in the range that matches the target weekday
  let current = rangeStart;
  const diffToFirst = (targetWeekday - current.day() + 7) % 7;
  if (diffToFirst !== 0) {
    current = current.add(diffToFirst, "day");
  }

  const occurrencesData: {
    startDateTime: Date;
    endDateTime: Date;
  }[] = [];

  while (current.isBefore(rangeEnd, "day") || current.isSame(rangeEnd, "day")) {
    const startDateTime = current
      .hour(timeStart.hour())
      .minute(timeStart.minute())
      .second(timeStart.second())
      .millisecond(timeStart.millisecond())
      .toDate();

    const endDateTime = current
      .hour(timeEnd.hour())
      .minute(timeEnd.minute())
      .second(timeEnd.second())
      .millisecond(timeEnd.millisecond())
      .toDate();

    occurrencesData.push({
      startDateTime,
      endDateTime,
    });

    // Move to the next week
    current = current.add(7, "day");
  }

  return occurrencesData;
};
