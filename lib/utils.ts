import { Note } from "@/models/note";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import moment from "moment";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import themeColor from "tailwindcss/colors";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const FORMAT_DATE_RETRIEVE = "YYYY-MM-DDTHH:mm:ss.SSSZ";
export const FORMAT_DATE_SAVE = "YYYY-MM-DD HH:mm:ss.SSS";

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
  };
}

export function remainingTimeInHour(time: { start: any; end: any }) {
  const time1 = moment(time.start, FORMAT_DATE_SAVE).format("HH:mm:ss");
  const time2 = moment(time.end, FORMAT_DATE_SAVE).format("HH:mm:ss");

  const format = "YYYY-MM-DD HH:mm:ss";
  const startTime = moment(`1970-01-01 ${time1}`, format);
  const endTime = moment(`1970-01-01 ${time2}`, format);

  const now = moment();
  const currentTime = moment(`1970-01-01 ${now.format("HH:mm:ss")}`, format);

  const duration = moment.duration(endTime.diff(currentTime));
  const hours = Math.floor(duration.asHours()).toString().padStart(2, "0");
  const minutes = duration.minutes().toString().padStart(2, "0");
  const seconds = duration.seconds().toString().padStart(2, "0");

  return {
    hours,
    minutes,
    seconds,
    string: `${hours}:${minutes}:${seconds}`,
    isTimesUp: !currentTime.isBetween(startTime, endTime),
  };
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
      case "image":
        if (result.includes("image-thumbnail")) {
          break;
        }
        result += `<img src="${block.data?.url}" class="image-thumbnail" />`;
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

export function hexToRgba(hex: string, opacity: number) {
  hex = hex.replace(/^#/, "");

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  let a = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${a}`;
}

export const easeDefault = [0.79, 0.14, 0.15, 0.86];

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
  "Youtube",
];

export const progressCheer = [
  {
    donepoint: 0,
    content: "Lets goo!",
    color: "text-yellow-400",
    bgColor: themeColor.yellow[400],
  },
  {
    donepoint: 1,
    content: "Good start!",
    color: "text-pink-400",
    bgColor: themeColor.pink[400],
  },
  {
    donepoint: 2,
    content: "Keep it up! 🔥",
    color: "text-red-400",
    bgColor: themeColor.red[400],
  },
  {
    donepoint: 3,
    content: "Few more to go! 😎",
    color: "text-blue-400",
    bgColor: themeColor.blue[400],
  },
  {
    donepoint: 4,
    content: "Finish, Good job! 🎉",
    color: "text-green-400",
    bgColor: themeColor.green[400],
  },
];

export const calculateShowProgress = ({
  taskDone,
  taskLength,
}: {
  taskDone: number;
  taskLength: number;
}) => {
  const progress = Math.round((taskDone / taskLength) * 100);
  const point = Math.floor(progress / (100 / progressCheer.length));
  const stepPoint = point === 0 ? point : point - 1;
  return stepPoint;
};

export const withoutSignPath = /^\/(signin|share\/[^/]+)$/;

export const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const getContentType = (base64String: string): string | null => {
  const matches = base64String.match(/^data:(.*);base64,/);
  return matches ? matches[1] : null;
};

export const downloadFileFromLink = (fileUrl: string, fileName: string) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
