bu_blocks.collapsibleControl = ( function() {

	// Store all Control blocks
	var collapsibleControlBlocks = [];
	var allCollapsibleBlocks = [];
	var allBlocksOpen = false;
	var collapsibleOpenClass = 'is-open';
	var collapsibleCloseClass = 'is-closed';

	/**
	 * Open or close a group of collapsible blocks
	 *
	 * @param array collapsible blocks
	 * @param bool true to open set of collapsible blocks, false to close
	 */
	var controlCollapsibleBlocks = function( collapsibleBlocks, open ) {

		if ( open === undefined ) {
			open = true;
		}

		collapsibleBlocks.forEach( function( collapsible, i ) {
			const container = collapsible.container;
			const toggle = collapsible.toggle;
			const panel = collapsible.panel;

			if ( open ) {
				container.classList.add( collapsibleOpenClass );
				container.classList.remove( collapsibleCloseClass );
				toggle.setAttribute( 'aria-expanded', true );
				panel.setAttribute( 'aria-hidden', false );
			} else {
				container.classList.remove( collapsibleOpenClass );
				container.classList.add( collapsibleCloseClass );
				toggle.setAttribute( 'aria-expanded', false );
				panel.setAttribute( 'aria-hidden', true );
			}

		} );

	}

	/**
	 * Toggle all Collapsible blocks
	 */
	var toggleAll = function( control ) {

		if ( 0 === allCollapsibleBlocks.length ) {
			return;
		}

		controlCollapsibleBlocks( allCollapsibleBlocks, !allBlocksOpen );
		allBlocksOpen = ( allBlocksOpen ) ? false : true;
	};

	/**
	 * Toggle Collapsible blocks in control's group
	 */
	var toggleGroup = function( control ) {
		const groupIsOpen = control.groupIsOpen;
		const collapsibleBlocks = control.collapsibleBlocks

		controlCollapsibleBlocks( collapsibleBlocks, !groupIsOpen );
		control.groupIsOpen = ( groupIsOpen ) ? false : true;
	};

	/**
	 * Find all Collapsible blocks on a page
	 */
	var findAllCollapsibleBlocks = function() {
		var containers = document.querySelectorAll( '.js-wp-block-bu-collapsible' );

		// Don't coninue if no Collapsible blocks exist
		if ( containers.length === 0 ) {
			return;
		}

		containers.forEach( function( element, i ) {
			var block = {};

			block.container = element;
			block.toggle = element.querySelector( '.js-bu-block-collapsible-toggle' );
			block.panel = element.querySelector( '.js-bu-block-collapsible-content' );
			allCollapsibleBlocks.push( block );
		} );

	};

	/**
	 * Return all Collapsible blocks in the group with a Control
	 *
	 * @param object control
	 *
	 * @return array list of all collapsible blocks in group
	 */
	var getGroupCollapsibleBlocks = function( control ) {

		var blocks = [];
		var group = control.closest( '.wp-block-group' );
		if ( ! group ) {
			return blocks;
		}
		var containers = group.querySelectorAll( '.js-wp-block-bu-collapsible' );

		containers.forEach( function( element, i ) {
			var block = {};

			block.container = element;
			block.toggle = element.querySelector( '.js-bu-block-collapsible-toggle' );
			block.panel = element.querySelector( '.js-bu-block-collapsible-content' );
			blocks.push( block );
		} );

		return blocks;
	}

	/**
	 * Find all Controls and Collapsible blocks
	 */
	var findElements = function() {

		var controls = document.querySelectorAll( '.bu-collapsible-control-toggle' );
		var allCollapsibleBlocksFound = false;

		// Don't coninue if no Controls are found
		if ( controls.length === 0 ) {
			return;
		}

		// Store all controls
		controls.forEach( function( control, i ) {
			var block = {};

			block.toggle = control;

			// Check if Control targets all blocks or blocks in its group
			if ( control.classList.contains( 'js-bu-collapsible-control-target-group' ) ) {
				block.targetGroup = true;
				block.collapsibleBlocks = getGroupCollapsibleBlocks( control );
				block.groupIsOpen = false;
			} else {
				block.targetGroup = false;

				if ( ! allCollapsibleBlocksFound ) {
					findAllCollapsibleBlocks();
				}

				allCollapsibleBlocksFound = true;
			}

			collapsibleControlBlocks.push( block );
		} );

	};

	/**
	 * Set up handlers, aria, and other functionality
	 */
	var setupCollapsibleControlBlocks = function() {
		if ( collapsibleControlBlocks.length === 0 ) {
			return;
		}

		collapsibleControlBlocks.forEach( function( control, i ) {
			const toggle = control.toggle;
			const targetGroup = control.targetGroup;

			toggle.addEventListener( 'click', function( e ) {
				e.preventDefault();
				if ( targetGroup ) {
					toggleGroup( control );
				} else {
					toggleAll( control );
				}
			} );
		} );

	};

	/**
	 * Init
	 */
	var collapsibleControlInit = function() {
		findElements();
		setupCollapsibleControlBlocks();
	};

	// Start things on dom ready.
	document.addEventListener( "DOMContentLoaded", function() {
		collapsibleControlInit();
	} );

} )();
