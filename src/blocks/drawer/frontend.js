bu_blocks.drawer = ( function() {
	var drawerBlocks = []; //stores all of our found blocks
	var $body = document.getElementsByTagName( 'body' )[0]; //target body tag
	var eventOpen = new CustomEvent( 'bu-blocks-drawer-open' );
	var eventClose = new CustomEvent( 'bu-blocks-drawer-close' );

	var toggleDrawer = function( drawer ) {

		// Using an if statement to check the class
		if ( drawer.classList.contains( 'show-drawer' ) ) {
			drawer.classList.remove( 'show-drawer' );
			//dispatch the event on the drawer dom element
			drawer.dispatchEvent( eventClose );
		} else {
			drawer.classList.add( 'show-drawer' );
			//dispatch the event on the drawer dom element
			drawer.dispatchEvent( eventOpen );
		}
	};

	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.js-bu-block-drawer' );
		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				var block = {};

				//get first returned drawer content element
				block.drawer = elements[i];
				//get all matched trigger btns
				block.button = elements[i].querySelectorAll( '.js-bu-block-drawer-open' );
				//get first returned overlay element
				block.close = elements[i].querySelector( '.js-bu-block-drawer-close' );

				//for each one found store as object in the array
				drawerBlocks.push( block );
			}
		}
	};

	var setupHandlers = function() {
		if ( drawerBlocks.length > 0 ) {
			drawerBlocks.forEach( function( thisDrawer, item ) {

				//some drawer blocks may have more than one trigger btn
				//so loop through all matched to setup events
				thisDrawer.button.forEach( function( button, index ) {
					//for each btn we find, add an event handler
					button.addEventListener( "click", function(e) {
						e.preventDefault();
						toggleDrawer( thisDrawer.drawer );
					});

				});

				thisDrawer.close.addEventListener( "click", function(e) {
					e.preventDefault();
					toggleDrawer( thisDrawer.drawer );
				});

			});
		}
	};

	var drawerInit = function() {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
  		drawerInit();

	});

	return {
		getdrawerBlocks: function() {
			return drawerBlocks;
		},
		toggleDrawer: function( drawer ) {
			if( drawer ) {
				toggleDrawer( drawer );
			}
		}
	};
})();