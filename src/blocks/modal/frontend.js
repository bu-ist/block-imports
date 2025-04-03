bu_blocks.modal = ( function () {
	const modalBlocks = [];
	const $body = document.getElementsByTagName( 'body' )[ 0 ];
	const eventOpen = new CustomEvent( 'bu-blocks-modal-open' );
	const eventClose = new CustomEvent( 'bu-blocks-modal-close' );

	const lockScroll = function () {
		$body.classList.add( 'bu-blocks-modal-noscroll' );
	};

	const unlockScroll = function () {
		$body.classList.remove( 'bu-blocks-modal-noscroll' );
	};

	const toggleModal = function ( overlay ) {
		// Using an if statement to check the class
		if ( overlay.classList.contains( 'show-overlay' ) ) {
			overlay.classList.remove( 'show-overlay' );
			//dispatch the event on the overlay dom element
			overlay.dispatchEvent( eventClose );
			unlockScroll();
		} else {
			overlay.classList.add( 'show-overlay' );
			//dispatch the event on the overlay dom element
			overlay.dispatchEvent( eventOpen );
			lockScroll();
		}
	};

	const findElements = function () {
		//find all the blocks
		const elements = document.querySelectorAll( '.js-bu-block-modal' );
		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			for ( let i = 0; i < elements.length; i++ ) {
				const block = {};

				//get first returned overlay element
				block.overlay = elements[ i ].querySelector(
					'.js-bu-block-modal-overlay'
				);
				//get all matched trigger btns
				block.button = elements[ i ].querySelectorAll(
					'.js-bu-block-modal-trigger-overlay'
				);
				//get first returned overlay element
				block.close = elements[ i ].querySelector(
					'.js-bu-block-modal-overlay-close'
				);

				//for each one found store as object in the array
				modalBlocks.push( block );
			}
		}
	};

	const setupHandlers = function () {
		if ( modalBlocks.length > 0 ) {
			modalBlocks.forEach( function ( thisModal, item ) {
				//some modals may have more than one trigger btn
				//so loop through all matched to setup events
				thisModal.button.forEach( function ( button, index ) {
					//for each btn we find, add an event handler
					button.addEventListener( 'click', function ( e ) {
						e.preventDefault();
						toggleModal( thisModal.overlay );
					} );
				} );
				thisModal.close.addEventListener( 'click', function ( e ) {
					e.preventDefault();
					toggleModal( thisModal.overlay );
				} );
			} );
		}
	};

	const modalInit = function () {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();
	};

	//start on dom ready (ie8+)
	document.addEventListener( 'DOMContentLoaded', function () {
		modalInit();
	} );

	return {
		getmodalBlocks() {
			return modalBlocks;
		},
		toggleModal( overlay ) {
			if ( overlay ) {
				toggleModal( overlay );
			}
		},
	};
} )();
