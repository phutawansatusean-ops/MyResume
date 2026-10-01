export interface Profile {
  name: string
  tagline: string
  /** Short bio shown on the home hero (Thai). */
  bio: string
  location: string
  email: string
  /** ISO date, e.g. 2007-10-07 */
  birthDate: string
  /** Optimized data URL or legacy download URL. Empty string = use /avatar.jpg. */
  avatarUrl: string
  /** Legacy Storage path; new Realtime Database images leave this empty. */
  avatarPath: string
  /** Longer About Me text. Separate paragraphs with a blank line. */
  about: string
}
