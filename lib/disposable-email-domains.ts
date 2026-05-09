/** Lowercase domains often used for throwaway / abuse signups (subset; extend as needed). */
const DISPOSABLE = new Set<string>([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "sharklasers.com",
  "pokemail.net",
  "spam4.me",
  "grr.la",
  "yopmail.com",
  "yopmail.fr",
  "throwaway.email",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "dispostable.com",
  "maildrop.cc",
  "getnada.com",
  "trashmail.com",
  "fakeinbox.com",
  "mailnesia.com",
  "mailcatch.com",
  "emailondeck.com",
  "mintemail.com",
  "mytrashmail.com",
  "spamgourmet.com",
  "mailnull.com",
  "spamdecoy.net",
  "mohmal.com",
  "emailfake.com",
  "crazymailing.com",
  "dropmail.me",
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "minuteinbox.com",
  "burnermail.io",
  "anonaddy.me",
  "mail.tm",
  "inboxkitten.com",
  "mailpoof.com",
  "tmpmail.org",
  "tmpmail.net",
  "emailnax.com",
  "vomoto.com",
  "tempr.email",
  "discard.email",
  "discardmail.com",
  "spambox.us",
  "armyspy.com",
  "cuvox.de",
  "dayrep.com",
  "einrot.com",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "trash-mail.com",
  "trashmail.de",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "wegwerfmail.org",
])

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@")
  if (at < 1) return false
  const domain = email.slice(at + 1).toLowerCase().trim()
  if (!domain) return false
  if (DISPOSABLE.has(domain)) return true
  // Subdomain of known disposable root (e.g. foo.mailinator.com)
  const parts = domain.split(".")
  for (let i = 0; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".")
    if (DISPOSABLE.has(parent)) return true
  }
  return false
}
