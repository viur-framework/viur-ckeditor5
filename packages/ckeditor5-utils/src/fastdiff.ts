/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { DiffResult } from './diff.js';
import type { Change } from './difftochanges.js';

/**
 * @module utils/fastdiff
 */

/**
 * Finds positions of the first and last change in the given string/array and generates a set of changes:
 *
 * ```ts
 * fastDiff( '12a', '12xyza' );
 * // [ { index: 2, type: 'insert', values: [ 'x', 'y', 'z' ] } ]
 *
 * fastDiff( '12a', '12aa' );
 * // [ { index: 3, type: 'insert', values: [ 'a' ] } ]
 *
 * fastDiff( '12xyza', '12a' );
 * // [ { index: 2, type: 'delete', howMany: 3 } ]
 *
 * fastDiff( [ '1', '2', 'a', 'a' ], [ '1', '2', 'a' ] );
 * // [ { index: 3, type: 'delete', howMany: 1 } ]
 *
 * fastDiff( [ '1', '2', 'a', 'b', 'c', '3' ], [ '2', 'a', 'b' ] );
 * // [ { index: 0, type: 'insert', values: [ '2', 'a', 'b' ] }, { index: 3, type: 'delete', howMany: 6 } ]
 * ```
 *
 * Passed arrays can contain any type of data, however to compare them correctly custom comparator function
 * should be passed as a third parameter:
 *
 * ```ts
 * fastDiff( [ { value: 1 }, { value: 2 } ], [ { value: 1 }, { value: 3 } ], ( a, b ) => {
 * 	return a.value === b.value;
 * } );
 * // [ { index: 1, type: 'insert', values: [ { value: 3 } ] }, { index: 2, type: 'delete', howMany: 1 } ]
 * ```
 *
 * The resulted set of changes can be applied to the input in order to transform it into the output, for example:
 *
 * ```ts
 * let input = '12abc3';
 * const output = '2ab';
 * const changes = fastDiff( input, output );
 *
 * changes.forEach( change => {
 * 	if ( change.type == 'insert' ) {
 * 		input = input.substring( 0, change.index ) + change.values.join( '' ) + input.substring( change.index );
 * 	} else if ( change.type == 'delete' ) {
 * 		input = input.substring( 0, change.index ) + input.substring( change.index + change.howMany );
 * 	}
 * } );
 *
 * // input equals output now
 * ```
 *
 * or in case of arrays:
 *
 * ```ts
 * let input = [ '1', '2', 'a', 'b', 'c', '3' ];
 * const output = [ '2', 'a', 'b' ];
 * const changes = fastDiff( input, output );
 *
 * changes.forEach( change => {
 * 	if ( change.type == 'insert' ) {
 * 		input = input.slice( 0, change.index ).concat( change.values, input.slice( change.index ) );
 * 	} else if ( change.type == 'delete' ) {
 * 		input = input.slice( 0, change.index ).concat( input.slice( change.index + change.howMany ) );
 * 	}
 * } );
 *
 * // input equals output now
 * ```
 *
 * By passing `true` as the fourth parameter (`atomicChanges`) the output of this function will become compatible with
 * the {@link module:utils/diff~diff `diff()`} function:
 *
 * ```ts
 * fastDiff( '12a', '12xyza', undefined, true );
 * // [ 'equal', 'equal', 'insert', 'insert', 'insert', 'equal' ]
 * ```
 *
 * The default output format of this function is compatible with the output format of
 * {@link module:utils/difftochanges~diffToChanges `diffToChanges()`}. The `diffToChanges()` input format is, in turn,
 * compatible with the output of {@link module:utils/diff~diff `diff()`}:
 *
 * ```ts
 * const a = '1234';
 * const b = '12xyz34';
 *
 * // Both calls will return the same results (grouped changes format).
 * fastDiff( a, b );
 * diffToChanges( diff( a, b ) );
 *
 * // Again, both calls will return the same results (atomic changes format).
 * fastDiff( a, b, undefined, true );
 * diff( a, b );
 * ```
 *
 * @typeParam T The type of array elements.
 * @typeParam AtomicChanges The type of `atomicChanges` parameter (selects the result type).
 * @param a Input array or string.
 * @param b Input array or string.
 * @param cmp Optional function used to compare array values, by default `===` (strict equal operator) is used.
 * @param atomicChanges Whether an array of `inset|delete|equal` operations should
 * be returned instead of changes set. This makes this function compatible with {@link module:utils/diff~diff `diff()`}.
 * Defaults to `false`.
 * @returns Array of changes. The elements are either {@link module:utils/diff~DiffResult} or {@link module:utils/difftochanges~Change},
 * depending on `atomicChanges` parameter.
 */
export default function fastDiff<T, AtomicChanges extends boolean = false>(
	a: ArrayLike<T>,
	b: ArrayLike<T>,
	cmp?: ( a: T, b: T ) => boolean,
	atomicChanges?: AtomicChanges
): Array<AtomicChanges extends true ? DiffResult : Change<T>> {
	// Set the comparator function.
	cmp = cmp || function( a, b ) {
		return a === b;
	};

	// Convert the string (or any array-like object - eg. NodeList) to an array by using the slice() method because,
	// unlike Array.from(), it returns array of UTF-16 code units instead of the code points of a string.
	// One code point might be a surrogate pair of two code units. All text offsets are expected to be in code units.
	// See ckeditor/ckeditor5#3147.
	//
	// We need to make sure here that fastDiff() works identical to diff().
	const arrayA: Array<T> = Array.isArray( a ) ? a : Array.prototype.slice.call( a );
	const arrayB: Array<T> = Array.isArray( b ) ? b : Array.prototype.slice.call( b );

	// Find first and last change.
	const changeIndexes = findChangeBoundaryIndexes( arrayA, arrayB, cmp );

	// Transform into changes array.
	const result = atomicChanges ?
		changeIndexesToAtomicChanges( changeIndexes, arrayB.length ) :
		changeIndexesToChanges( arrayB, changeIndexes );

	return result as any;
}

/**
 * Finds position of the first and last change in the given arrays. For example:
 *
 * ```ts
 * const indexes = findChangeBoundaryIndexes( [ '1', '2', '3', '4' ], [ '1', '3', '4', '2', '4' ] );
 * console.log( indexes ); // { firstIndex: 1, lastIndexOld: 3, lastIndexNew: 4 }
 * ```
 *
 * The above indexes means that in the first array the modified part is `1[23]4` and in the second array it is `1[342]4`.
 * Based on such indexes, array with `insert`/`delete` operations which allows transforming first value into the second one
 * can be generated.
 */
function findChangeBoundaryIndexes<T>( arr1: ReadonlyArray<T>, arr2: ReadonlyArray<T>, cmp: ( a: T, b: T ) => boolean ): ChangeIndexes {
	// Find the first difference between passed values.
	const firstIndex = findFirstDifferenceIndex( arr1, arr2, cmp );

	// If arrays are equal return -1 indexes object.
	if ( firstIndex === -1 ) {
		return { firstIndex: -1, lastIndexOld: -1, lastIndexNew: -1 };
	}

	// Remove the common part of each value and reverse them to make it simpler to find the last difference between them.
	const oldArrayReversed = cutAndReverse( arr1, firstIndex );
	const newArrayReversed = cutAndReverse( arr2, firstIndex );

	// Find the first difference between reversed values.
	// It should be treated as "how many elements from the end the last difference occurred".
	//
	// For example:
	//
	// 				initial	->	after cut	-> reversed:
	// oldValue:	'321ba'	->	'21ba'		-> 'ab12'
	// newValue:	'31xba'	->	'1xba'		-> 'abx1'
	// lastIndex:							-> 2
	//
	// So the last change occurred two characters from the end of the arrays.
	const lastIndex = findFirstDifferenceIndex( oldArrayReversed, newArrayReversed, cmp );

	// Use `lastIndex` to calculate proper offset, starting from the beginning (`lastIndex` kind of starts from the end).
	const lastIndexOld = arr1.length - lastIndex;
	const lastIndexNew = arr2.length - lastIndex;

	return { firstIndex, lastIndexOld, lastIndexNew };
}

/**
 * Returns a first index on which given arrays differ. If both arrays are the same, -1 is returned.
 */
function findFirstDifferenceIndex<T>( arr1: ReadonlyArray<T>, arr2: ReadonlyArray<T>, cmp: ( a: T, b: T ) => boolean ): number {
	for ( let i = 0; i < Math.max( arr1.length, arr2.length ); i++ ) {
		if ( arr1[ i ] === undefined || arr2[ i ] === undefined || !cmp( arr1[ i ], arr2[ i ] ) ) {
			return i;
		}
	}

	return -1; // Return -1 if arrays are equal.
}

/**
 * Returns a copy of the given array with `howMany` elements removed starting from the beginning and in reversed order.
 *
 * @param arr Array to be processed.
 * @param howMany How many elements from array beginning to remove.
 * @returns Shortened and reversed array.
 */
function cutAndReverse<T>( arr: ReadonlyArray<T>, howMany: number ): Array<T> {
	return arr.slice( howMany ).reverse();
}

/**
 * Generates changes array based on change indexes from `findChangeBoundaryIndexes` function. This function will
 * generate array with 0 (no changes), 1 (deletion or insertion) or 2 records (insertion and deletion).
 *
 * @param newArray New array for which change indexes were calculated.
 * @param changeIndexes Change indexes object from `findChangeBoundaryIndexes` function.
 * @returns Array of changes compatible with {@link module:utils/difftochanges~diffToChanges} format.
 */
function changeIndexesToChanges<T>( newArray: ReadonlyArray<T>, changeIndexes: ChangeIndexes ): Array<Change<T>> {
	const result: Array<Change<T>> = [];
	const { firstIndex, lastIndexOld, lastIndexNew } = changeIndexes;

	// Order operations as 'insert', 'delete' array to keep compatibility with {@link module:utils/difftochanges~diffToChanges}
	// in most cases. However, 'diffToChanges' does not stick to any order so in some cases
	// (for example replacing '12345' with 'abcd') it will generate 'delete', 'insert' order.
	if ( lastIndexNew - firstIndex > 0 ) {
		result.push( {
			index: firstIndex,
			type: 'insert',
			values: newArray.slice( firstIndex, lastIndexNew )
		} );
	}

	if ( lastIndexOld - firstIndex > 0 ) {
		result.push( {
			index: firstIndex + ( lastIndexNew - firstIndex ), // Increase index of what was inserted.
			type: 'delete',
			howMany: lastIndexOld - firstIndex
		} );
	}

	return result;
}

/**
 * Generates array with set `equal|insert|delete` operations based on change indexes from `findChangeBoundaryIndexes` function.
 *
 * @param changeIndexes Change indexes object from `findChangeBoundaryIndexes` function.
 * @param newLength Length of the new array on which `findChangeBoundaryIndexes` calculated change indexes.
 * @returns Array of changes compatible with {@link module:utils/diff~diff} format.
 */
function changeIndexesToAtomicChanges( changeIndexes: ChangeIndexes, newLength: number ): Array<DiffResult> {
	const { firstIndex, lastIndexOld, lastIndexNew } = changeIndexes;

	// No changes.
	if ( firstIndex === -1 ) {
		return Array( newLength ).fill( 'equal' );
	}

	let result: Array<DiffResult> = [];

	if ( firstIndex > 0 ) {
		result = result.concat( Array( firstIndex ).fill( 'equal' ) );
	}

	if ( lastIndexNew - firstIndex > 0 ) {
		result = result.concat( Array( lastIndexNew - firstIndex ).fill( 'insert' ) );
	}

	if ( lastIndexOld - firstIndex > 0 ) {
		result = result.concat( Array( lastIndexOld - firstIndex ).fill( 'delete' ) );
	}

	if ( lastIndexNew < newLength ) {
		result = result.concat( Array( newLength - lastIndexNew ).fill( 'equal' ) );
	}

	return result;
}

/**
 * Indexes of the first and the last change in the given arrays.
 */
interface ChangeIndexes {

	/**
	 * Index of the first change in both values (always the same for both).
	 */
	firstIndex: number;

	/**
	 * Index of the last common value in `arr1`.
	 */
	lastIndexOld: number;

	/**
	 * Index of the last common value in `arr2`.
	 */
	lastIndexNew: number;
}
