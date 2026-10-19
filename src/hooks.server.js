import { redirect } from "@sveltejs/kit";

const TARGET =
  "https://raw.githubusercontent.com/saravenpi/dotfiles/main/install.sh";
const REDIRECTS = new Set([
  "/install",
  "/install.sh",
  "/dotfiles",
  "/dotfiles.sh",
]);

export function handle({ event, resolve }) {
  const path = event.url.pathname.replace(/\/$/, "");
  if (REDIRECTS.has(path) || REDIRECTS.has(event.url.pathname)) {
    redirect(307, TARGET);
  }

  return resolve(event);
}
