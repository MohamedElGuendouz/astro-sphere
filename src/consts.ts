import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "EL GUENDOUZ",
  DESCRIPTION: "Welcome to Astro Sphere, a portfolio and blog for designers and developers.",
  AUTHOR: "Mark Horn",
}

// Work Page
export const WORK: Page = {
  TITLE: "Parcours",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Articles",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Réalisations",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Parcours", 
    HREF: "/work", 
  },
  { 
    TEXT: "Articles", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Réalisations", 
    HREF: "/projects", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "mohamed.elguendouz@outlook.fr",
    HREF: "mailto:mohamed.elguendouz@outlook.fr",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "MohamedElGuendouz",
    HREF: "https://github.com/MohamedElGuendouz"
  },
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "melg-0686aa151",
    HREF: "https://www.linkedin.com/in/melg-0686aa151/",
  },
]
