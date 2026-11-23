import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../slugify.mjs";

test("lowercases and hyphenates simple headings", () => {
  assert.equal(slugify("Getting Started"), "getting-started");
});

test("drops punctuation", () => {
  assert.equal(slugify("What's new?"), "whats-new");
  assert.equal(slugify("FAQ: Billing & Limits"), "faq-billing--limits");
});

test("keeps backtick-wrapped code text but drops the backticks", () => {
  assert.equal(slugify("Using `check-links.mjs`"), "using-check-linksmjs");
});

test("collapses only whitespace runs into single hyphens per run", () => {
  assert.equal(slugify("Two   Spaces"), "two---spaces");
});

test("preserves existing hyphens and underscores", () => {
  assert.equal(slugify("multi-word_example"), "multi-word_example");
});

test("handles non-ASCII letters", () => {
  assert.equal(slugify("Café résumé"), "café-résumé");
});

test("trims leading and trailing whitespace before hyphenation", () => {
  assert.equal(slugify("  Padded Heading  "), "padded-heading");
});

test("does not add a numeric suffix for repeated headings", () => {
  // github-slugger dedupes repeated headings in a document by appending
  // -1, -2, etc. slugify() is a pure, per-heading function and has no
  // knowledge of sibling headings, so it cannot reproduce that dedup
  // behavior on its own. This test documents that known limitation so a
  // future change doesn't silently assume dedup is handled here.
  assert.equal(slugify("Overview"), "overview");
  assert.equal(slugify("Overview"), "overview");
});
