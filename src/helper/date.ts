import { format, formatDistance, isToday, isYesterday } from "date-fns";

export const formatDate = (date = '') => {
    const newDate = date ? new Date(date) : new Date();

    if (isToday(newDate)) {
      return formatDistance(newDate, Date.now(), { addSuffix: true });
    }

    if (isYesterday(newDate)) {
      return `Yesterday at ${format(newDate, "kk:mm")}`;
    }

    return format(newDate, "dd MMMM yyyy kk:mm");
}