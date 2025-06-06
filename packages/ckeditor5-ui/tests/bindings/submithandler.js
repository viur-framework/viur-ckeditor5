/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import submitHandler from '../../src/bindings/submithandler.js';

import View from '../../src/view.js';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils.js';

describe( 'submitHandler', () => {
	let view;

	testUtils.createSinonSandbox();

	beforeEach( () => {
		view = new View();
		view.element = document.createElement( 'div' );
		view.element.child = document.createElement( 'input' );

		view.element.appendChild( view.element.child );

		submitHandler( { view } );
	} );

	it( 'should fire #submit event on the view and prevent the native DOM #submit', done => {
		const evt = new Event( 'submit' );
		const spy = sinon.spy( evt, 'preventDefault' );

		view.on( 'submit', () => {
			sinon.assert.calledOnce( spy );
			done();
		} );

		view.element.child.dispatchEvent( evt );
	} );
} );
