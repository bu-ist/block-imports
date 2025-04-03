import { IconSet } from './types';

/**
 * Returns an action object used in signalling that new block styles have been added.
 *
 * @param {Object} iconSet icon set.
 *
 * @return {Object} Action object.
 */
export function registerIconSet( iconSet: IconSet ) {
	return {
		type: 'REGISTER_ICON_SET',
		iconSet,
	} as const;
}

/**
 * Returns an action object used in signalling that block styles have been removed.
 *
 * @param {string} name Icon Set name.
 *
 * @return {Object} Action object.
 */
export function removeIconSet( name: string ) {
	return {
		type: 'REMOVE_ICON_SET',
		name,
	} as const;
}

export type IconSetAction =
	| ReturnType< typeof registerIconSet >
	| ReturnType< typeof removeIconSet >;
