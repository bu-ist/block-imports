// WordPress dependencies.
import { __ } from '@wordpress/i18n';

import { Fragment } from '@wordpress/element';

import {
	Button,
	PanelBody,
	PanelRow,
	ExternalLink,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';

import { decodeEntities } from '@wordpress/html-entities';

export const PostChooserSidebar = function ( props ) {
	const {
		children,
		postID,
		postTitle,
		postURL,
		selectHandler,
		onRemovePost,
	} = props;

	const onhandleRemovePost = ( e ) => {
		// Let the block code take care of further handling.
		// Call passed onSelectPost Function.
		if ( onRemovePost instanceof Function ) {
			onRemovePost( e );
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Selected Post' ) }
					className="bu-components-post-chooser-sidebar-options"
				>
					<>
						<PanelRow>
							{ postTitle && (
								<>
									<h2>
										Title: { decodeEntities( postTitle ) }
									</h2>
									{ postURL && (
										<p>
											<ExternalLink href={ postURL }>
												View Post
											</ExternalLink>
										</p>
									) }
								</>
							) }
						</PanelRow>
						<PanelRow>
							<Flex wrap={ true }>
								<FlexItem>{ children }</FlexItem>
								{ postID && (
									<FlexBlock>
										<Button
											//variant="tertiary"
											isLink
											onClick={ ( e ) => {
												onhandleRemovePost( e );
											} }
										>
											Remove
										</Button>
									</FlexBlock>
								) }
							</Flex>
						</PanelRow>
					</>
				</PanelBody>
			</InspectorControls>
		</>
	);
};
