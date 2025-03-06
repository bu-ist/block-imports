// External dependencies.
import classnames from 'classnames';


import {
	Spinner
} from '@wordpress/components';


// Import CSS.
import './editor.scss';


/**
 * Returns the class list for the component based on the current settings.
 *
 * @param {string} className  Additional classes assigned to the component.
 * @param {string} text     If the component has loading text set.
 * @param {string} shadow    If the component has a shadow set.
 */
const getClasses = ( className, text, shadow ) => classnames(
	'bu-components-loading-spinner',
	{
		[ `has-shadow` ]: shadow,
		[ `has-text` ]: text,
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
		<>
			<div className={ getClasses( className, text, shadow ) }>
				{ text && (
					<strong className="bu-components-loading-spinner-label">{ text }</strong>
				)}
				 <Spinner />
			</div>
		</>
	)
};
