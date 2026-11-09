/**
 * Accessibility props for a chart: with a label it is one image with that
 * text alternative; without one it is decorative and hidden from assistive tech.
 */
export function chartA11y(label?: string) {
  return label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);
}
