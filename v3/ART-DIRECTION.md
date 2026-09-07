# SocialBot board v3 — art direction

- **Column beats row.** Five skinny day cards side-by-side starved the draft of width and forced fixed-height boxes with inner scrollbars. Stacking days full-width (~760px) lets copy read like a document, not a dashboard card wall.
- **Kill nested scroll.** Inner `overflow: auto` on DRAFT boxes created cramped double-scroll (page + box). v3 puts the full LinkedIn draft in document flow — height grows with content; X sits behind a tab that also shows full text with no scroller.
- **Broadsheet / racing-program energy.** Cream paper `#F4EFE0`, ink `#1B1612`, hairline rules between days, oversized rust livery numerals (M T W T F). Not floating cards, not chrome-heavy widgets.
- **Rust sparingly.** `#C84518` for brand label, day numerals, draft labels, section headers — never fat button fills everywhere. Primary actions use ink; Kill stays outline rust.
- **Copy first.** Day header → one-line blurb → draft body. Metadata collapses under a quiet `#6B5B45` summary so editorial review starts with the words that ship.
- **Inline editors, same page.** LinkedIn / X edit panes expand in place; Save writes `localStorage`. No route changes, no modal maze.
- **Story queue under the week.** Alternates as a stacked list beneath the column — promote marks intent without competing with the primary week copy.
- **Max width ~760px centered.** Measure suited to reading long LinkedIn drafts; mirrors print column width, not a five-across calendar grid.
