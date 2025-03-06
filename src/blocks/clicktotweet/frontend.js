bu_blocks.clicktotweet = ( function() {
	var tweetBlocks = []; //stores all of our found blocks
	var tweetLabel = "Tweet this";

	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.wp-block-bu-clicktotweet' );
		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			elements.forEach( function( theBlock, item ) {

				var block = {};

				// Get DOM element.
				block.element = theBlock;

				// Check if this block has a highlight subsection of text
				if ( theBlock.classList.contains('has-format-highlight') ) {
					block.highlight = theBlock.querySelector( '.wp-block-bu-clicktotweet-highlight');

					// Get and store the highlighted text as our text to tweet.
					block.tweet_text = block.highlight.innerText;
				} else {
					// Get the entire paragraph's text to tweet.
					block.tweet_text = theBlock.innerText;
				}

				//for each one found store as object in the array
				tweetBlocks.push( block );
			});
		}
	};

	/*
	Setup click handlers for these blocks
	*/
	var setupHandlers = function() {
		if ( tweetBlocks.length > 0 ) {

			// Loop through all found Tweet Blocks
			tweetBlocks.forEach( function( theBlock, item ) {
				var btn;

				// If has subtext highlighted to tweet use that.
				if ( theBlock.highlight ) {
					btn = theBlock.highlight;
				} else {
					// Otherwise append the tweet button for the whole <p>.
					btn = document.createElement( 'button' );
					btn.appendChild( document.createTextNode( tweetLabel ) );
					btn.classList.add( 'wp-block-bu-clicktotweet-action' );
					btn.classList.add( 'js-wp-block-clicktotweet-action' );
					theBlock.element.appendChild( btn );

					// Store reference to the btn.
					theBlock.btn = btn;
				}

				// If we have a button element, setup click handler
				// to open Tweet window.
				if ( btn ) {
					btn.addEventListener( "click", function(e) {
						e.preventDefault();
						openTweet( theBlock.tweet_text );
					});
				}

			});
		}
	};

	/*
	Opens a small window with
	the Twitter Link Sharing Tool open and
	passes the text of the tweet and url
	of the post	to Twitter.
	*/
	var openTweet = function( text ) {
		var tweetedLink = window.location.href;

  		window.open(
  			"http://twitter.com/intent/tweet?url=" + tweetedLink +
  			"&text=" + text +
  			"&",
  			"twitterwindow",
  			"height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0"
  		);

	};

	/*
	Helper function to set the Button text
	to a new value on new and existing blocks.
	 */
	var setButtonText = function( str ) {
		tweetLabel = str;

		tweetBlocks.forEach( function( theBlock, item ) {
			if( theBlock.btn ) {
				theBlock.btn.innerText = tweetLabel;
			}
		});
	};

	var tweetInit = function() {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
  		tweetInit();

	});

	return {
		gettweetBlocks: function() {
			return tweetBlocks;
		},
		settweetButtonText: function( str ) {
			setButtonText( str );
		}
	};
})();