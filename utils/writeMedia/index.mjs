export function writeMedia( tag, src, alt, classes,  ) {

  let htmlEl = null;

  switch (tag) {
    case figure:
      // Statements executed when the result of expression matches value2
      htmlEl = `<figure class={ classes }>
  <img src={ src } alt=>
  <figcaption>{ alt }</figcaption>
</figure>`;
      break;
    // ... more cases
    case picture:
      // Statements executed when the result of expression matches value1
      htmlEl = `<picture class={ classes }>
  <source srcset="mdn-logo-wide.png" media="(min-width: 600px)" />
  <img src={ src } alt={ alt } />
</picture>`;
      break;
    default:
     // Statements executed when none of the cases match the result of the expression
      htmlEl = `<img src={ src } alt={ alt } class={ classes } />`;
  }

  return htmlEl;
}
