import { assign, merge, difference, findIndex } from "lodash";
import update from "immutability-helper";

import {
	LOAD_ALL_ENTITY_TYPES,
	LOAD_ALL_ENTITY_TYPES_SUCCESS,
	SELECT_ENTITY_TYPE,
	UPDATE_TREE,
	UPDATE_TREE_SELECTION,
	SHOW_LINKER,
	HIDE_LINKER,
	SHOW_PROPERTY_CREATOR,
	HIDE_PROPERTY_CREATOR,
	ENTITY_RESULTS_SEARCH,
	ENTITY_RESULTS_SEARCH_SUCCESS,
	ENTITY_RESULTS_SEARCH_MORE,
	UPDATE_RESULTS_STATS,
	ENTITY_REMOVE
} from "../actions/types";

export const initialState = {
	allEntityTypes: [],
	tree: [],
	expandedNodes: [],
	selectedNodes: [],
	selectedEntityTypeId: null,
	isFetchingEntityTypes: false,
	linkerOpen: false,
	linkToEntity: null,
	linkIntent: null,
	propertyCreatorOpen: false,
	entitySearchResults: {
		fetchingEntityResults: false,
		fetchingEntityResultsMore: false,
		offset: 0,
		limit: 20,
		count: null,
		all: []
	},
	searchResultsStats: {}
};

export const pageOntologyReducer = (state = initialState, action) => {
	switch (action.type) {
		case SELECT_ENTITY_TYPE:
			return assign({}, state, {
				selectedEntityTypeId: action.entityTypeId
			});
		case LOAD_ALL_ENTITY_TYPES:
			return assign({}, state, {
				isFetchingEntityTypes: true
			});
		case LOAD_ALL_ENTITY_TYPES_SUCCESS:
			return assign({}, state, {
				allEntityTypes: action.payload,
				isFetchingEntityTypes: false
			});
		case UPDATE_TREE:
			return assign({}, state, {
				tree: action.payload
			});
		case UPDATE_TREE_SELECTION:
			return assign({}, state, {
				expandedNodes: action.expanded,
				selectedNodes: action.selected
			});
		case SHOW_LINKER:
			return assign({}, state, {
				linkerOpen: true,
				linkToEntity: action.entityTypeId,
				linkIntent: action.linkIntent
			});
		case HIDE_LINKER:
			return assign({}, state, {
				linkerOpen: false,
				linkToEntity: null,
				linkIntent: null
			});
		case SHOW_PROPERTY_CREATOR:
			return assign({}, state, {
				propertyCreatorOpen: true,
				selectedProperty: action.property
			});
		case HIDE_PROPERTY_CREATOR:
			return assign({}, state, {
				propertyCreatorOpen: false,
				selectedProperty: null
			});

		case ENTITY_RESULTS_SEARCH: {
			let updatedResults = assign({}, state.entitySearchResults, {
				fetchingEntityResults: true,
				all: []
			});
			return assign({}, state, {
				entitySearchResults: updatedResults
			});
		}

		case ENTITY_RESULTS_SEARCH_MORE: {
			let updatedResults = assign({}, state.entitySearchResults, {
				fetchingEntityResultsMore: true,
				offset: action.offset,
				limit: action.limit
			});
			return assign({}, state, {
				entitySearchResults: updatedResults
			});
		}

		case ENTITY_RESULTS_SEARCH_SUCCESS: {
			let newArray = state.entitySearchResults.all.concat(action.all);

			let updatedResults = assign({}, state.entitySearchResults, {
				fetchingEntityResults: false,
				fetchingEntityResultsMore: false,
				offset: action.offset,
				limit: action.limit,
				count: action.count,
				all: newArray
			});
			return assign({}, state, {
				entitySearchResults: updatedResults
			});
		}

		case UPDATE_RESULTS_STATS:
			return assign({}, state, {
				searchResultsStats: action.stats
			});

		case ENTITY_REMOVE: {
			let entityToRemoveIndex = findIndex(state.entitySearchResults.all, {
				_id: action.payload
			});

			let newEntitiesArray = update(state.entitySearchResults.all, {
				$splice: [[entityToRemoveIndex, 1]]
			});

			let updatedResults = assign({}, state.entitySearchResults, {
				all: newEntitiesArray,
				count: state.entitySearchResults.count - 1
			});
			return assign({}, state, {
				entitySearchResults: updatedResults
			});
		}
		default:
			return state;
	}
};
