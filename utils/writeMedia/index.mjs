/**
 * Returns todo.
 *
 * @param {string} tag  todo.
 * @param {string} imgObj     todo.
 * @param {string} alt    todo.
 * @param {string} classes    todo.
 * @param {string} srcset    todo.
 */

export function writeMedia( tag, imgObj, alt='', classes='', srcset=null ) {

  let htmlEl = null;

  switch (tag) {
    case 'figure':
      // Don't do alt and caption, just caption.
      // https://stackoverflow.com/questions/58447538/accessibility-difference-between-img-alt-and-figcaption
      htmlEl = `<figure class="${ classes }">`;
      htmlEl += `<img src="${ imgObj.src }" alt="">`;
      if(alt){
        htmlEl += `<figcaption>${ alt }</figcaption>`;
      }
      htmlEl += `</figure>`;
      break;
    case 'picture':
      htmlEl = `<picture class="${ classes }">`;
      if( srcset ){
        for (let i = 0; i < srcset.sources.length; i++) {
          let source = srcset.sources[i];
          htmlEl += `<source srcset="${source.srcset}"`;
          htmlEl += source.media ? ` media="${source.media}"` : ``;
          htmlEl += source.type ? ` type="${source.type}"` : ``;
          htmlEl += ` />`;
        }
      }
      htmlEl += `<img src="${ imgObj.src }" alt="${ alt }" />`;
      htmlEl += `</picture>`;
      break;
    default:
      htmlEl = `<img src="${ imgObj.src }" alt="${ alt }" class="${ classes }" />`;
  }

  return htmlEl;
}
