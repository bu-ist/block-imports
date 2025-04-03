/*
Custom Event Polyfill
https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
*/
( function () {
	if ( typeof window.CustomEvent === 'function' ) {
		return false;
	}

	function CustomEvent( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: null };
		const evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent(
			event,
			params.bubbles,
			params.cancelable,
			params.detail
		);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
} )();

/*
.matches() polyfill:
https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
if ( ! Element.prototype.matches ) {
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
if ( ! Array.prototype.findIndex ) {
	Object.defineProperty( Array.prototype, 'findIndex', {
		value( predicate ) {
			// 1. Let O be ? ToObject(this value).
			if ( this == null ) {
				throw new TypeError( '"this" is null or not defined' );
			}

			const o = Object( this );

			// 2. Let len be ? ToLength(? Get(O, "length")).
			const len = o.length >>> 0;

			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if ( typeof predicate !== 'function' ) {
				throw new TypeError( 'predicate must be a function' );
			}

			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			const thisArg = arguments[ 1 ];

			// 5. Let k be 0.
			let k = 0;

			// 6. Repeat, while k < len
			while ( k < len ) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return k.
				const kValue = o[ k ];
				if ( predicate.call( thisArg, kValue, k, o ) ) {
					return k;
				}
				// e. Increase k by 1.
				k++;
			}

			// 7. Return -1.
			return -1;
		},
		configurable: true,
		writable: true,
	} );
}

// Matches polyfill.
if ( ! Element.prototype.matches ) {
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}
// element.closest() polyfill.
if ( ! Element.prototype.closest ) {
	Element.prototype.closest = function ( s ) {
		let el = this;

		do {
			if ( Element.prototype.matches.call( el, s ) ) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		} while ( el !== null && el.nodeType === 1 );
		return null;
	};
}

// Foreach NodeList Polyfill for IE.
if ( 'NodeList' in window && ! NodeList.prototype.forEach ) {
	console.info( 'polyfill for IE11' );
	NodeList.prototype.forEach = function ( callback, thisArg ) {
		thisArg = thisArg || window;
		for ( let i = 0; i < this.length; i++ ) {
			callback.call( thisArg, this[ i ], i, this );
		}
	};
}

// Foreach Polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if ( ! Array.prototype.forEach ) {
	Array.prototype.forEach = function ( callback /*, thisArg*/ ) {
		let T, k;

		if ( this == null ) {
			throw new TypeError( 'this is null or not defined' );
		}

		// 1. Let O be the result of calling toObject() passing the
		// |this| value as the argument.
		const O = Object( this );

		// 2. Let lenValue be the result of calling the Get() internal
		// method of O with the argument "length".
		// 3. Let len be toUint32(lenValue).
		const len = O.length >>> 0;

		// 4. If isCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if ( typeof callback !== 'function' ) {
			throw new TypeError( callback + ' is not a function' );
		}

		// 5. If thisArg was supplied, let T be thisArg; else let
		// T be undefined.
		if ( arguments.length > 1 ) {
			T = arguments[ 1 ];
		}

		// 6. Let k be 0.
		k = 0;

		// 7. Repeat while k < len.
		while ( k < len ) {
			var kValue;

			// a. Let Pk be ToString(k).
			//    This is implicit for LHS operands of the in operator.
			// b. Let kPresent be the result of calling the HasProperty
			//    internal method of O with argument Pk.
			//    This step can be combined with c.
			// c. If kPresent is true, then
			if ( k in O ) {
				// i. Let kValue be the result of calling the Get internal
				// method of O with argument Pk.
				kValue = O[ k ];

				// ii. Call the Call internal method of callback with T as
				// the this value and argument list containing kValue, k, and O.
				callback.call( T, kValue, k, O );
			}
			// d. Increase k by 1.
			k++;
		}
		// 8. return undefined.
	};
}

//Classlist polyfill
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ( 'document' in self ) {
	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (
		! ( 'classList' in document.createElement( '_' ) ) ||
		( document.createElementNS &&
			! (
				'classList' in
				document.createElementNS( 'http://www.w3.org/2000/svg', 'g' )
			) )
	) {
		( function ( view ) {
			'use strict';

			if ( ! ( 'Element' in view ) ) {
				return;
			}

			const classListProp = 'classList',
				protoProp = 'prototype',
				elemCtrProto = view.Element[ protoProp ],
				objCtr = Object,
				strTrim =
					String[ protoProp ].trim ||
					function () {
						return this.replace( /^\s+|\s+$/g, '' );
					},
				arrIndexOf =
					Array[ protoProp ].indexOf ||
					function ( item ) {
						let i = 0,
							len = this.length;
						for ( ; i < len; i++ ) {
							if ( i in this && this[ i ] === item ) {
								return i;
							}
						}
						return -1;
					},
				// Vendors: please allow content code to instantiate DOMExceptions
				DOMEx = function ( type, message ) {
					this.name = type;
					this.code = DOMException[ type ];
					this.message = message;
				},
				checkTokenAndGetIndex = function ( classList, token ) {
					if ( token === '' ) {
						throw new DOMEx(
							'SYNTAX_ERR',
							'An invalid or illegal string was specified'
						);
					}
					if ( /\s/.test( token ) ) {
						throw new DOMEx(
							'INVALID_CHARACTER_ERR',
							'String contains an invalid character'
						);
					}
					return arrIndexOf.call( classList, token );
				},
				ClassList = function ( elem ) {
					let trimmedClasses = strTrim.call(
							elem.getAttribute( 'class' ) || ''
						),
						classes = trimmedClasses
							? trimmedClasses.split( /\s+/ )
							: [],
						i = 0,
						len = classes.length;
					for ( ; i < len; i++ ) {
						this.push( classes[ i ] );
					}
					this._updateClassName = function () {
						elem.setAttribute( 'class', this.toString() );
					};
				},
				classListProto = ( ClassList[ protoProp ] = [] ),
				classListGetter = function () {
					return new ClassList( this );
				};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[ protoProp ] = Error[ protoProp ];
			classListProto.item = function ( i ) {
				return this[ i ] || null;
			};
			classListProto.contains = function ( token ) {
				token += '';
				return checkTokenAndGetIndex( this, token ) !== -1;
			};
			classListProto.add = function () {
				let tokens = arguments,
					i = 0,
					l = tokens.length,
					token,
					updated = false;
				do {
					token = tokens[ i ] + '';
					if ( checkTokenAndGetIndex( this, token ) === -1 ) {
						this.push( token );
						updated = true;
					}
				} while ( ++i < l );

				if ( updated ) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				let tokens = arguments,
					i = 0,
					l = tokens.length,
					token,
					updated = false,
					index;
				do {
					token = tokens[ i ] + '';
					index = checkTokenAndGetIndex( this, token );
					while ( index !== -1 ) {
						this.splice( index, 1 );
						updated = true;
						index = checkTokenAndGetIndex( this, token );
					}
				} while ( ++i < l );

				if ( updated ) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function ( token, force ) {
				token += '';

				const result = this.contains( token ),
					method = result
						? force !== true && 'remove'
						: force !== false && 'add';
				if ( method ) {
					this[ method ]( token );
				}

				if ( force === true || force === false ) {
					return force;
				}
				return ! result;
			};
			classListProto.toString = function () {
				return this.join( ' ' );
			};

			if ( objCtr.defineProperty ) {
				const classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true,
				};
				try {
					objCtr.defineProperty(
						elemCtrProto,
						classListProp,
						classListPropDesc
					);
				} catch ( ex ) {
					// IE 8 doesn't support enumerable:true
					// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
					// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
					if (
						ex.number === undefined ||
						ex.number === -0x7ff5ec54
					) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(
							elemCtrProto,
							classListProp,
							classListPropDesc
						);
					}
				}
			} else if ( objCtr[ protoProp ].__defineGetter__ ) {
				elemCtrProto.__defineGetter__( classListProp, classListGetter );
			}
		} )( self );
	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	( function () {
		'use strict';

		let testElement = document.createElement( '_' );

		testElement.classList.add( 'c1', 'c2' );

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if ( ! testElement.classList.contains( 'c2' ) ) {
			const createMethod = function ( method ) {
				const original = DOMTokenList.prototype[ method ];

				DOMTokenList.prototype[ method ] = function ( token ) {
					let i,
						len = arguments.length;

					for ( i = 0; i < len; i++ ) {
						token = arguments[ i ];
						original.call( this, token );
					}
				};
			};
			createMethod( 'add' );
			createMethod( 'remove' );
		}

		testElement.classList.toggle( 'c3', false );

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if ( testElement.classList.contains( 'c3' ) ) {
			const _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function ( token, force ) {
				if ( 1 in arguments && ! this.contains( token ) === ! force ) {
					return force;
				}
				return _toggle.call( this, token );
			};
		}

		testElement = null;
	} )();
}

const bu_blocks = {};
