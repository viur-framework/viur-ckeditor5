import Balloon from '@ckeditor/ckeditor5-build-balloon';
import BalloonBlock from '@ckeditor/ckeditor5-build-balloon-block';
import Classic from '@ckeditor/ckeditor5-build-classic';
import DecoupledDocument from '@ckeditor/ckeditor5-build-decoupled-document';
import Inline from '@ckeditor/ckeditor5-build-inline';

import AbbreviationPlugin from './abbreviation/abbreviation';

/**
 * The main goal of this file was to check TypeScript compatibility. Running
 * this demo will result in the `ckeditor-duplicated-modules` error.
 * 
 * If you need to run any of these editors, you need to comment our all other
 * editors and their respective imports.
 */

Balloon
	.create( document.querySelector<HTMLElement>( '#balloon' )!, {
		plugins: [
			AbbreviationPlugin
		]
	} )
	.then ( editor => {
		editor.data.get();
	} );

BalloonBlock
	.create( document.querySelector<HTMLElement>( '#balloon-block' )!, {
		plugins: [
			AbbreviationPlugin
		]
	} )
	.then( editor => {
		editor.data.get();
	} );

Classic
	.create( document.querySelector<HTMLElement>( '#classic' )!, {
		plugins: [
			AbbreviationPlugin
		]
	} )
	.then( editor => {
		editor.data.get();
	} );

DecoupledDocument
	.create( document.querySelector<HTMLElement>( '#decoupled-document' )!, {
		plugins: [
			AbbreviationPlugin
		]
	} )
	.then( editor => {
		editor.data.get();
	} );

Inline
	.create( document.querySelector<HTMLElement>( '#inline' )!, {
		plugins: [
			AbbreviationPlugin
		]
	} )
	.then( editor => {
		editor.data.get();
	} );
