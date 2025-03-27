/**
 * Returns todo.
 *
 * @param {string} mediaObj  todo.
 * @param {string} size     todo.
 * @param {string} sizeFallback    todo.
 */

export function getMedia( mediaObj, size='full', sizeFallback=false ) {

  let sizeToFetch = '';

  if( mediaObj.media_details.sizes[size] ){
    sizeToFetch = size;
  } else if ( mediaObj.media_details.sizes[sizeFallback] ) {
    sizeToFetch = sizeFallback;
  } else {
    return false;
  }

  const imgObj = {
    src: mediaObj.media_details.sizes[sizeToFetch].source_url,
    alt: mediaObj.alt_text,
    author: mediaObj.author,
    title: mediaObj.title.raw, // raw or rendered?
    caption: mediaObj.caption.raw, // raw or rendered?
    description: mediaObj.description.raw, // raw or rendered?
    height: mediaObj.media_details.sizes[sizeToFetch].height,
    width: mediaObj.media_details.sizes[sizeToFetch].width,
    mime_type: mediaObj.mime_type
  };

  return imgObj;
}
