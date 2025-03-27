export function getMedia( media, size, sizeFallback ) {

  const mediaObj = {
    src: media.media_details.sizes[size].source_url,
    alt: media.alt_text,
    height: "500",
    width: "white"
  };

  return mediaObj;
}
