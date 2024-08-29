import { Note } from "@/models/note";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import moment from "moment";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ"

export function formatDate(date: any) {
  const now = dayjs();
  const givenDate = dayjs(date);

  if (now.diff(givenDate, "day") < 1) {
    return givenDate.fromNow(); // e.g., "yesterday at 4pm"
  } else {
    return givenDate.format("dddd D MMM"); // e.g., "Saturday 20 Aug"
  }
}

export function remainingTimeInDays(unitOfTime: moment.unitOfTime.StartOf) {
  const endOfWeek = moment().endOf(unitOfTime);

  const duration = moment.duration(endOfWeek.diff(moment()));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return {
    days,
    hours,
    minutes,
    seconds,
    string: `${days} day, ${hours}:${minutes}:${seconds}`,
    isTimesUp: !moment().isBetween(moment().startOf("week"), endOfWeek),
  }
}

export function remainingTimeInHour(time: { start: any, end: any }) {
  const time1 = moment(time.start, ISO_FORMAT).format("HH:mm:ss");
  const time2 = moment(time.end, ISO_FORMAT).format("HH:mm:ss");

  const format = "YYYY-MM-DD HH:mm:ss";
  const startTime = moment(`1970-01-01 ${time1}`, format);
  const endTime = moment(`1970-01-01 ${time2}`, format);

  const now = moment();
  const currentTime = moment(`1970-01-01 ${now.format('HH:mm:ss')}`, format);

  const duration = moment.duration(endTime.diff(currentTime));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes()
  const seconds = duration.seconds();

  return {
    hours,
    minutes,
    seconds,
    string: `${hours}:${minutes}:${seconds}`,
    isTimesUp: !currentTime.isBetween(startTime, endTime),
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const iconsProvider = [
  {
    id: "google",
    icon: FaGoogle,
  },
  {
    id: "github",
    icon: FaGithub,
  },
];

export class ApiError extends Error {
  constructor(message = "Api error") {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class ServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(message);
    this.name = "ServerError";
  }
}

export function convertEditorDataToText(data: Note["note"]) {
  const blocks = data?.blocks;
  let result = "";

  blocks?.forEach((block) => {
    switch (block.type) {
      case "header":
        result += block.data.text;
        result += "<br />";
        break;
      case "paragraph":
        result += block.data.text;
        result += "<br />";
        break;
      case "list":
        block.data.items.forEach((item: string) => {
          result += " - " + item + "<br />";
        });
        result += "<br />";
        break;
      case "linkTool":
        result += block.data?.link;
        result += "<br />";
        break;
      case "checklist":
        block.data.items.forEach((item: any) => {
          result += " - " + item.text + "<br />";
        });
        result += "<br />";
        break;
      case "quote":
        result += block.data?.text + " - " + block.data?.caption + "<br />";
        result += "<br />";
        break;
      default:
        break;
    }
  });

  return result;
}

export async function pause(time: number = 1) {
  await new Promise((r) => setTimeout(r, time * 1000));
}

export const easeDefault = [0.79, 0.14, 0.15, 0.86]

export const defaultIcons = [
  "Accessibility",
  "Eye",
  "Sun",
  "Moon",
  "Activity",
  "BadgeCheck",
  "Award",
  "Bell",
  "Handshake",
  "CreditCard",
  "House",
  "NotebookTabs",
  "ThumbsUp",
  "ThumbsDown",
  "Tag",
  "Star",
  "UserRound",
  "Wallet",
  "Wrench",
  "Airplay",
  "Bitcoin",
  "Chrome",
  "Codepen",
  "Codesandbox",
  "Dribbble",
  "Facebook",
  "Figma",
  "Github",
  "Instagram",
  "Linkedin",
  "Slack",
  "Twitter",
  "Trello",
  "Youtube"
];