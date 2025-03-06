export function umlautEverything( text ) {
	text = text.replaceAll( 'a', 'ä' );
	text = text.replaceAll( 'o', 'ö' );
	text = text.replaceAll( 'u', 'ü' );
	return text;
}
