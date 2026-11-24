// Approximates rehype-slug (github-slugger): lowercase, drop punctuation, spaces become hyphens.
export function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}
