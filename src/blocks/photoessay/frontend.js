bu_blocks.photoessay = (function() {
	var scrollTop = 0;
	var photoEssayBlocks = []; //stores all of our found blocks
	var photoEssayGroups = [];
	var photoEssayOverlay = false;
	var photoEssayFigures = {};
	var overlayActiveGroup = false;
	var $html = document.getElementsByTagName( 'html' )[0]; //target html tag
	var $body = document.getElementsByTagName( 'body' )[0]; //target body tag


	/*
	* Find all photo essay blocks
	* and store in an array.
	*
	* For each found get all of the DOM
	* elements we'll need
	*
	*/
	var findElements = function() {
		//find all the blocks
		var findBlocks = document.querySelectorAll( '.js-block-editorial-photoessay' );
		var elements = [].slice.call( findBlocks );

		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				var group = Array();

				var block = {};
				block.element = elements[i];

				//get first returned social photo block element
				group.push( block );


				var siblings = getSiblings( elements[i], '.js-block-editorial-photoessay'  );

				if ( siblings.length > 0 ) {

					//add siblings to group.
					siblings.forEach( function( sibling, index ) {
						var sib = {};
						sib.element = sibling;
						group.push( sib );
					});

					//reduce elements array by removing the siblings
					elements.splice(i, siblings.length);

				}

				//for each one found store as object in the array
				photoEssayGroups.push( group );
			}





		}
	};


	/*
	* For Each Photo Essay Block Setup:
	*
	* Setup the Overlay Container DOM elements.
	*
	* Find each Figure inside each block inside each group and build
	* an array for each "group" with all of the figures in order so we
	* can later traverse.
	*
	* Then call setupHandlers() to setup
	* remaining event handlers for opening the overlay, etc.
	*
	*/
	var setupBlocks = function() {
		if ( photoEssayGroups.length > 0 ) {

			photoEssayOverlay = {};
			photoEssayOverlay.container = appendOverlay();
			photoEssayOverlay.closeBtn = photoEssayOverlay.container.querySelector( '.js-block-editorial-photoessay-overlay-close' );
			photoEssayOverlay.prevBtn = photoEssayOverlay.container.querySelector( '.js-block-editorial-photoessay-overlay-prev' );
			photoEssayOverlay.nextBtn = photoEssayOverlay.container.querySelector( '.js-block-editorial-photoessay-overlay-next' );
			photoEssayOverlay.photoContainer = photoEssayOverlay.container.querySelector( '.wp-block-editorial-photoessay-photocontainer' );


			// Foreach Group let's assign an id
			// and then traverse the blocks to find all of the
			// figure elements and push them into a global object.
			photoEssayGroups.forEach( function( group, index ) {

				// Create an id for each group.
				var groupID = "photoEssay_"+index;

				// Add an object with a key of the group id.
				photoEssayFigures[groupID] = Array();

				//group.figures = Array();
				// Loop through each Group and iterate on the blocks.
				group.forEach( function( block, item ) {

					// Find all of the Figure elements for the block as
					// each photoessay block can support multiple photos.
					block.figures = block.element.querySelectorAll( 'figure' );

					// For each Figure element push it into the global object
					// under the key for that group.
					block.figures.forEach( function( figure, item ) {
						photoEssayFigures[groupID].push( figure );
					});

				});

			});

			// Setup this block.
			setupHandlers();
		}
	};


	/*
	* Setup Handler for clicking on images/figure elements
	* and opening the overlay with the selected figure (image)
	* element.
	*/
	var openPhotoHandler = function( figure, group ) {
		// setup click handler
		figure.addEventListener( 'click', function(e) {
			e.preventDefault();

			//Set as Active Group
			overlayActiveGroup = photoEssayFigures[group];

			// Add the selected figure to the overlay
			overlayAddContent( figure );

			// Open the Photo Overlay.
			overlayToggle();
		});
	};

	/*
	* Setup remaining Handlers
	* for Progress Bar and Audio Complete Callbacks
	*
	* These use callbacks set in the global Audio API
	*/
	var setupHandlers = function() {

		for ( group in photoEssayFigures ) {

			photoEssayFigures[group].forEach( function( figure, item ) {
				openPhotoHandler( figure, group );
			});

		}

		photoEssayOverlay.closeBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			overlayToggle();
		});

		function nextSharedAction() {
			var next = nextPhoto();
			removeActiveFigure();
			overlayAddContent( overlayActiveGroup[next] );
		}

		photoEssayOverlay.nextBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			nextSharedAction();
		});

		function prevSharedAction() {
			var prev = prevPhoto();
			removeActiveFigure();
			overlayAddContent( overlayActiveGroup[prev] );
		}

		photoEssayOverlay.prevBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			prevSharedAction();
		});

		document.onkeydown = checkKey;

		function checkKey(e) {
			e = e || window.event;
			if (e.keyCode == '39') {
				nextSharedAction();
			}
			else if (e.keyCode == '37') {
				prevSharedAction();
			}
		}

	};



	/*
	* Next Photo
	*
	* Find the next photo in the
	* currently active group if any exist.
	*
	* Return the index to that item in the array.
	*/
	var nextPhoto = function() {
		var next = false;
		var last = overlayActiveGroup.length -1;

		var current = overlayActiveGroup.findIndex( function( element ){
			return element.classList.contains( 'active' );
		});

		if ( current < last ) {
			next = current + 1;
		} else if ( current === last ) {
			next = 0;
		}

		return next;

	};


	/*
	* Previous Photo
	*
	* Find the previous photo in the
	* currently active group if any exist.
	*
	* Return the index to that item in the array.
	*/
	var prevPhoto = function() {
		var prev = false;
		var last = overlayActiveGroup.length -1;

		var current = overlayActiveGroup.findIndex( function( element ){
			return element.classList.contains( 'active' );
		});

		if ( current > 0 ) {
			prev = current - 1;
		} else if ( current === 0 ) {
			prev = last;
		}

		return prev;

	};


	/*
	* Open/Close Overlay
	*
	* Additionally sets up an event listener to
	* monitor scroll events when the overlay is open.
	*/
	var overlayToggle = function() {

		if( $html.classList.contains( 'show-photo-essay-overlay' ) ) {
			// Closing: Remove event listener.
			document.removeEventListener( 'scroll', scrollEvent );
		} else {
			// Opening: Add Event Listener.
			document.addEventListener( 'scroll', scrollEvent );

			// Set current ScrollTop position.
			scrollTop = $html.scrollTop;
		}

		//Toggle the show-overlay class.
		overlayClass();
	};


	/*
	* Event Handler for scroll event
	*
	* Handles closing the overlay if the user
	* intends to scroll "out" of it and continue reading.
	*
	* Serves as an alternative to the close button.
	*/
	var scrollEvent = function( e ) {
		if( $html.scrollTop - scrollTop > 250 ) {
			//console.log("close");
			// Reset scrollTop.
			scrollTop = 0;

			// Remove Event Listener until next overlay is open.
			document.removeEventListener( 'scroll', scrollEvent );

			// Close Overlay.
			overlayClass();
		}
	};


	/*
	* Toggle the "show" class for the overlay
	* element by toggling the class on the
	* HTML tag.
	*/
	var overlayClass = function() {
		if ( overlayActiveGroup.length > 1 ) {
			$html.classList.toggle( 'photo-essay-overlay-has-multiple' );
		}
		$html.classList.toggle( 'show-photo-essay-overlay' );
	};


	/*
	* Remove all "active" classes on any
	* figure element in the active group.
	*/
	var removeActiveFigure = function() {
		for (var i = 0; i < overlayActiveGroup.length; i++) {
			if (overlayActiveGroup[i].matches('.active')) {
				overlayActiveGroup[i].classList.remove('active');
			}
		}
	};


	/*
	* Add clone of image & caption figure
	* to the overlay component
	*
	* @param figure the figure to clone and add.
	*/
	var overlayAddContent = function( figure ) {

		figure.classList.add("active");

		// Clone with child elements.
		var newFigure = figure.cloneNode( true );

		// Clean anything that might exist.
		photoEssayOverlay.photoContainer.innerHTML = '';

		// Append to overlay container.
		photoEssayOverlay.photoContainer.appendChild( newFigure );

		//Wrap the img tag in a span for better styling.
		wrapElement( photoEssayOverlay.photoContainer.querySelector( 'img' ), document.createElement( 'span' ) );
	};


	/*
	* Add Overlay to the body
	*
	*/
	var appendOverlay = function() {
		var element = document.createElement( 'div' );

		var html = overlayTemplate();
		element.innerHTML = html;

		return $body.appendChild( element );
	};

	/*
	* Wrap an element in  some html:
	*
	* example: wrapElement(document.querySelector('a.wrap_me'), document.createElement('div'));
	*
	*/
	var wrapElement = function( el, wrapper ) {
		el.parentNode.insertBefore( wrapper, el );
		wrapper.appendChild( el );
	}


	/*
	* Generate the template for the
	* Overlay to display larger photos
	* in from each photoessay block.
	*/
	var overlayTemplate = function() {

		var html = [
			'<div class="wp-block-editorial-photoessay-overlay">',
				'<nav class="wp-block-editorial-photoessay-overlay-nav">',
					'<button class="wp-block-editorial-photoessay-overlay-prev js-block-editorial-photoessay-overlay-prev"><span>Previous</span></button>',
					'<button class="wp-block-editorial-photoessay-overlay-close js-block-editorial-photoessay-overlay-close"><span>Close</span></button>',
					'<button class="wp-block-editorial-photoessay-overlay-next js-block-editorial-photoessay-overlay-next"><span>Next</span></button>',
				'</nav>',
				'<div class="wp-block-editorial-photoessay-container">',
					'<div class="wp-block-editorial-photoessay-photocontainer">',
					'</div>',
				'</div>',
			'</div>',
		].join("\n");

		return html;
	};

	/*
	* Get Siblings of the passed element until
	* selector doesn't match.
	*
	* Returns Array of sibling elements.
	*/
	var getSiblings = function ( elem, selector ) {

		// Setup siblings array
		var siblings = [];

		// Get the next sibling element
		elem = elem.nextElementSibling;

		// As long as a sibling exists
		while (elem) {

			// If selector doesn't match, bail
			if ( ! elem.matches(selector) ) break;

			// Otherwise, push it to the siblings array
			siblings.push(elem);

			// Get the next sibling element
			elem = elem.nextElementSibling;

		}

		return siblings;

	};


	var init = function() {
		//find the elements
		findElements();

		//setup blocks
		setupBlocks();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
		init();

	});

	return {
		getBlocks: function() {
			return photoEssayBlocks;
		},
		getActiveGroup: function() {
			return overlayActiveGroup;
		}
	};
})();