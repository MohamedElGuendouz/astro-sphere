import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "EL GUENDOUZ",
  DESCRIPTION: "Data Engineer et Architecte spécialisé dans les environnements Cloud.",
  AUTHOR: "Mohamed El Guendouz",
}

// Work Page
export const WORK: Page = {
  TITLE: "Parcours",
  DESCRIPTION: "Lieux où j'ai travaillé.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Articles",
  DESCRIPTION: "Écrits sur des sujets qui me passionnent.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Réalisations",
  DESCRIPTION: "Projets récents sur lesquels j'ai travaillé.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Recherche",
  DESCRIPTION: "Rechercher tous les articles et réalisations par mot-clé.",
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
