export interface TechStyle {
  bg: string;
  slug: string; // Simple Icons slug for the logo
}

const TECH_MAP: Record<string, TechStyle> = {
  // Languages
  typescript:   { bg: "#3178c6", slug: "typescript" },
  javascript:   { bg: "#f7df1e", slug: "javascript" },
  python:       { bg: "#3776ab", slug: "python" },
  go:           { bg: "#00add8", slug: "go" },
  rust:         { bg: "#ce422b", slug: "rust" },
  java:         { bg: "#ed8b00", slug: "openjdk" },
  kotlin:       { bg: "#7f52ff", slug: "kotlin" },
  "c#":         { bg: "#239120", slug: "csharp" },
  php:          { bg: "#777bb4", slug: "php" },
  ruby:         { bg: "#cc342d", slug: "ruby" },
  swift:        { bg: "#fa7343", slug: "swift" },
  dart:         { bg: "#0175c2", slug: "dart" },
  // Frontend
  react:        { bg: "#20232a", slug: "react" },
  vue:          { bg: "#4fc08d", slug: "vuedotjs" },
  angular:      { bg: "#dd0031", slug: "angular" },
  "next.js":    { bg: "#000000", slug: "nextdotjs" },
  vite:         { bg: "#646cff", slug: "vite" },
  html:         { bg: "#e34f26", slug: "html5" },
  css:          { bg: "#264de4", slug: "css3" },
  tailwind:     { bg: "#06b6d4", slug: "tailwindcss" },
  // Backend / Runtime
  "node.js":    { bg: "#339933", slug: "nodedotjs" },
  express:      { bg: "#4a4a4a", slug: "express" },
  fastify:      { bg: "#2d3436", slug: "fastify" },
  django:       { bg: "#092e20", slug: "django" },
  flask:        { bg: "#000000", slug: "flask" },
  rails:        { bg: "#cc0000", slug: "rubyonrails" },
  // Database / ORM
  postgresql:   { bg: "#336791", slug: "postgresql" },
  mysql:        { bg: "#4479a1", slug: "mysql" },
  mongodb:      { bg: "#47a248", slug: "mongodb" },
  redis:        { bg: "#dc382d", slug: "redis" },
  prisma:       { bg: "#2d3748", slug: "prisma" },
  sqlite:       { bg: "#003b57", slug: "sqlite" },
  // Infra / Tools
  docker:       { bg: "#2496ed", slug: "docker" },
  aws:          { bg: "#232f3e", slug: "amazonaws" },
  gcp:          { bg: "#4285f4", slug: "googlecloud" },
  azure:        { bg: "#0078d4", slug: "microsoftazure" },
  graphql:      { bg: "#e10098", slug: "graphql" },
  git:          { bg: "#f05032", slug: "git" },
  github:       { bg: "#181717", slug: "github" },
  vercel:       { bg: "#000000", slug: "vercel" },
  jest:         { bg: "#c21325", slug: "jest" },
};

export function getTechStyle(tech: string): TechStyle {
  return TECH_MAP[tech.toLowerCase()] ?? { bg: "#888", slug: "" };
}

export function getAllKnownTechs(): string[] {
  return Object.keys(TECH_MAP);
}
