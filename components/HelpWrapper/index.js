// External dependencies.
import classnames from 'classnames';

import { useState } from 'react';
import { Popover, Icon } from '@wordpress/components';

// Import CSS.
import './editor.scss';

/**
 * Returns the class list for the component based on the current settings.
 *
 * @param {string} className Additional classes assigned to the component.
 * @param          offset
 */
const getClasses = ( className, offset ) =>
	classnames( 'bu-components-help-wrapper', {
		[ className ]: className,
		[ `has-offset-label` ]: offset,
	} );

export const HelpWrapper = ( props ) => {
	const {
		text = undefined,
		className = undefined,
		offset = undefined,
		children,
	} = props;

	const [ popoverVisible, setPopoverVisible ] = useState( false );

	const toggleVisible = () => {
		setPopoverVisible( ( state ) => ! state );
	};

	return (
		<>
			<div className={ getClasses( className, offset ) }>
				<div className="bu-components-help-wrapper-container">
					<>
						<Icon
							onClick={ toggleVisible }
							icon="editor-help"
							size="20"
						>
							{ popoverVisible && (
								<Popover
									className="bu-components-help-wrapper-popover"
									noArrow={ false }
									onFocusOutside={ toggleVisible }
								>
									{ text }
								</Popover>
							) }
						</Icon>
					</>
				</div>
				{ children }
			</div>
		</>
	);
};
