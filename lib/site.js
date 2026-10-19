export const SITE_NAME = "HomesalesFairfax";
export const SITE_URL = "https://homesalesfairfax.com";

export function absoluteUrl(path) {
  return new URL(path, SITE_URL).toString();
}

// Header links mirror the live homesalesfairfax.com header. Point these at the
// live routes once those pages exist in this project.
export const NAV_LINKS = [
  { href: "/calculator", label: "Calculator" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about-elena", label: "About Elena" },
];

export const HEADER_BUTTON = {
  href: "/book-listing-consultation",
  label: "Book Listing Consultation",
};

// Left empty on purpose; set a display string here to show a phone number.
export const HEADER_PHONE = "";
