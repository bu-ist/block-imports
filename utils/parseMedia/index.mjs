export function parseMedia( media, size ) {
  return (
    <img src={ media.media_details.sizes[size].source_url } alt={ media.alt_text } />
  );
}
