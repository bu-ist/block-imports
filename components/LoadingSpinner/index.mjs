/**
 * A loading spinner to be used to indicate some activity is occuring.
 *
 * @return {Element} Element to render, in this case an DIV.
 */

// External dependencies.
import classnames from 'classnames';

// Import the WP Spinner component.
import { Spinner } from '@wordpress/components';

// Import CSS.
import './editor.scss';

/**
 * Returns the class list for the component based on the current settings.
 *
 * @param {string} className	Additional classes assigned to the component.
 * @param {string} text			If the component has loading text set.
 * @param {string} shadow		If the component has a shadow set.
 */
const getClasses = ( className, text, shadow ) => classnames(
	'bu-components-loading-spinner',
	{
		[ `bu-components-loading-spinner--has-shadow` ]: shadow,
		[ `bu-components-loading-spinner--has-text` ]: text,
		[ className ]: className,
	}
);

export const LoadingSpinner = ( props ) => {
	const {
		text = undefined,
		shadow = true,
		className = undefined
	} = props;

	return (
		<div className={ getClasses( className, text, shadow ) }>
			{ text && (
				<strong className="bu-components-loading-spinner--label">{ text }</strong>
			)}
				<Spinner />
		</div>
	)
};
