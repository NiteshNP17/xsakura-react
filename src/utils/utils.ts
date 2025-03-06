import axios from "axios";
import config from "./config";

function formatNames(namesArray: string[]) {
  // Capitalize the first letter of each name
  const formattedNames = namesArray.map((name) => {
    const words = name.split(" ");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  });

  return formattedNames.join(", ");
}

function formatCode(str: string) {
  // Remove any leading/trailing whitespace
  str = str.trim();

  // Find the index of the last letter in the string
  let lastLetterIndex = -1;
  for (let i = str.length - 1; i >= 0; i--) {
    if (isNaN(+str[i]) && str[i] !== " ") {
      lastLetterIndex = i;
      break;
    }
  }

  // If no letter is found, return the original string
  if (lastLetterIndex === -1) {
    return str;
  }

  // Find the index of the first number after the last letter
  let firstNumberIndex = -1;
  for (let i = lastLetterIndex + 1; i < str.length; i++) {
    if (!isNaN(+str[i])) {
      firstNumberIndex = i;
      break;
    }
  }

  // If no number is found after the last letter, return the original string
  if (firstNumberIndex === -1) {
    return str;
  }

  // Check if a hyphen or space already exists between the last letter and the first number
  // const hasHyphen = str[lastLetterIndex] === "-";
  const hasHyphen = str.includes("-") || str.includes("_");

  const hasSpace = str[lastLetterIndex + 1] === " ";

  if (hasHyphen) return str;

  // If a hyphen or space doesn't exist, insert a hyphen
  if (!hasHyphen && !hasSpace) {
    const modifiedStr = `${str.slice(0, lastLetterIndex + 1)}-${str.slice(
      firstNumberIndex,
    )}`;
    return modifiedStr;
  }

  // If a hyphen or space already exists, remove any spaces and return the string
  const modifiedStr = `${str.slice(0, lastLetterIndex + 1)}-${str
    .slice(firstNumberIndex)
    .replace(/ /g, "")}`;
  return modifiedStr;
}

function calculateAge(dobDate: Date, referenceDate: Date): number {
  const diffInMilliseconds = referenceDate.getTime() - dobDate.getTime();
  const ageInYears = Math.floor(
    diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25),
  );

  return ageInYears;
}

function ageCompare(givenDate: Date, referenceDate: Date): string {
  const diffInMilliseconds = givenDate.getTime() - referenceDate.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) {
    // Given date is later than reference date
    const diffYears = Math.floor(Math.abs(diffInDays) / 365);
    const diffMonths = Math.floor((Math.abs(diffInDays) % 365) / 30);
    const diffDays = Math.abs(diffInDays) % 30;

    let result = "";
    if (diffYears > 0) {
      result += `+${diffYears}y `;
    }
    if (diffMonths > 0) {
      result += `${diffMonths}m`;
    } else if (diffDays > 0) {
      result += `${diffDays}d`;
    }

    return result.trim();
  } else {
    // Given date is earlier than reference date
    const diffYears = Math.floor(diffInDays / 365);
    const diffMonths = Math.floor((diffInDays % 365) / 30);
    const diffDays = diffInDays % 30;

    let result = "";
    if (diffYears > 0) {
      result += `-${diffYears}y `;
    }
    if (diffMonths > 0) {
      result += `${diffYears === 0 ? "-" : ""}${diffMonths}m`;
    } else if (diffDays > 0) {
      result += `-${diffDays}d`;
    }

    return result.trim();
  }
}

function formatHeight(heightCm: number): string {
  // Convert centimeters to inches
  const heightInches = heightCm / 2.54;

  // Calculate feet and remaining inches
  const feet = Math.floor(heightInches / 12);
  const inches = Math.round(heightInches % 12);

  // Handle cases where inches >= 12 or inches === 0
  const adjustedFeet = inches >= 12 ? feet + 1 : feet;
  const adjustedInches = inches >= 12 ? inches % 12 : inches;

  // Format the output string
  const feetString = adjustedFeet > 0 ? `${adjustedFeet}'` : "";
  const inchesString = adjustedInches > 0 ? ` ${adjustedInches}"` : "";
  return `${feetString}${inchesString}`.trim();
}

async function movieExists(movieCode: string) {
  try {
    const res = await axios.get(
      `${config.apiUrl}/movies/${movieCode.toLowerCase()}`,
    );
    if (res) return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response.status === 404) return false;
  }
}

const getRainbowColor = (letter: string): string => {
  // Normalize the letter to lowercase
  const char = letter.toLowerCase();

  // Define the rainbow color mapping
  const colorMap: { [key: string]: string } = {
    a: "text-indigo-400 dark:text-indigo-300",
    b: "text-blue-500 dark:text-blue-300",
    c: "text-cyan-500",
    d: "text-emerald-500 dark:text-emerald-400",
    e: "text-green-500",
    f: "text-lime-400",
    g: "text-yellow-400",
    h: "text-amber-500",
    i: "text-orange-500",
    j: "text-orange-600",
    k: "text-red-500",
    l: "text-red-600",
    m: "text-rose-500",
  };

  // Return the color if the letter exists, otherwise return a default color
  return colorMap[char] + " font-semibold" || "text-gray-500";
};

export {
  formatNames,
  formatCode,
  calculateAge,
  ageCompare,
  formatHeight,
  movieExists,
  getRainbowColor,
};
