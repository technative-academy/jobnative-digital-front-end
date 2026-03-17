const DEFAULT_TONES = ["purple", "green", "blue", "amber"];

const AVATAR_TONES = ["purple", "green", "blue", "pink", "orange", "cyan"];

const BADGE_TONES_BY_LABEL = {
  angular: "blue",
  aws: "blue",
  "aws lambda": "blue",
  azure: "blue",
  csharp: "blue",
  "c sharp": "blue",
  css: "blue",
  cybersecurity: "violet",
  django: "amber",
  docker: "cyan",
  dotnet: "blue",
  "e commerce and retail": "amber",
  "ed tech": "violet",
  edtech: "violet",
  express: "green",
  figma: "violet",
  fintech: "purple",
  firebase: "amber",
  frontend: "purple",
  "frontend developer": "purple",
  gaming: "blue",
  git: "orange",
  github: "orange",
  go: "green",
  golang: "green",
  graphql: "violet",
  java: "purple",
  javascript: "purple",
  kubernetes: "green",
  "machine learning": "violet",
  mongodb: "green",
  mysql: "blue",
  "next js": "purple",
  nextjs: "purple",
  "node js": "green",
  node: "green",
  php: "violet",
  postgres: "blue",
  postgresql: "blue",
  productivity: "blue",
  python: "green",
  rails: "amber",
  react: "purple",
  "react native": "purple",
  ruby: "amber",
  software: "violet",
  sql: "blue",
  svelte: "orange",
  tailwind: "blue",
  travel: "green",
  "travel tech": "green",
  typescript: "blue",
  "ui ux": "violet",
  vue: "blue",
  "vue js": "blue",
};

function normalizeToken(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hashValue(value) {
  const normalizedValue = normalizeToken(value) || "jobnative";
  let hash = 0;

  for (let index = 0; index < normalizedValue.length; index += 1) {
    hash = (hash * 31 + normalizedValue.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getStableTone(value, tones = DEFAULT_TONES) {
  return tones[hashValue(value) % tones.length];
}

function cleanSegment(segment) {
  return segment.replace(/[^a-zA-Z0-9]+/g, "");
}

function splitNameParts(name) {
  return String(name ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(cleanSegment)
    .filter(Boolean);
}

export function getAvatarTone(name) {
  return getStableTone(name, AVATAR_TONES);
}

export function getCompanyMonogram(name) {
  const parts = splitNameParts(name);

  if (parts.length === 0) {
    return "?";
  }

  const [firstPart, secondPart] = parts;

  if (parts.length > 1 && !/^\d/.test(firstPart)) {
    const secondCharacter = secondPart?.[0] || firstPart[1] || firstPart[0];
    return `${firstPart[0] ?? ""}${secondCharacter ?? ""}`.toUpperCase();
  }

  return firstPart.slice(0, 2).toUpperCase();
}

export function getBadgeTone(label, category = "generic") {
  const normalizedLabel = normalizeToken(label);

  if (
    Object.prototype.hasOwnProperty.call(BADGE_TONES_BY_LABEL, normalizedLabel)
  ) {
    return BADGE_TONES_BY_LABEL[normalizedLabel];
  }

  if (category === "industry") {
    return getStableTone(label, ["purple", "blue", "green", "violet"]);
  }

  if (category === "role") {
    return getStableTone(label, ["purple", "blue", "green", "amber"]);
  }

  if (category === "sponsor") {
    return getStableTone(label, ["blue", "purple", "green", "amber"]);
  }

  if (category === "technology") {
    return getStableTone(label, ["purple", "green", "blue", "amber"]);
  }

  return getStableTone(label);
}

export function getTagTone(label, category = "generic") {
  return getBadgeTone(label, category);
}
