/**
 * External dependencies
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import isObject from 'lodash/isObject.js';

/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Hook for retrieving data from the WordPress REST API.
 *
 * @param {string} entity           The entity to retrieve. Defaults to postType.
 * @param {string} kind             The entity kind to retrieve. Defaults to posts.
 * @param {object | number} [query] Optional. Query to pass to the geEntityRecords request. Defaults to an empty object. If a number is passed, it is used as the ID of the entity to retrieve via getEntityRecord.
 * @returns {Array} The data returned from the request.
 */
export const useRequestData = (entity='postType', kind='post', query = {} ) => {
	const functionToCall = isObject(query) ? 'getEntityRecords' : 'getEntityRecord';
	const { invalidateResolution } = useDispatch('core/data');
	const { data, isLoading } = useSelect(
		(select) => {
			return {
				data: select(coreStore)[functionToCall](entity, kind, query),
				isLoading: select('core/data').isResolving(coreStore, functionToCall, [
					entity,
					kind,
					query,
				]),
			};
		},
		[entity, kind, query],
	);

	const invalidateResolver = () => {
		invalidateResolution(coreStore, functionToCall, [entity, kind, query]);
	};

	return [data, isLoading, invalidateResolver];
};
