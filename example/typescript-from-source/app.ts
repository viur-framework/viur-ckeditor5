import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';

/* @ts-ignore */
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import Abbreviation from './abbreviation/abbreviation';

ClassicEditor
	.create( document.querySelector( '#editor' ) as HTMLElement, {
		plugins: [ Essentials, Paragraph, Bold, Italic, Abbreviation, Table, TableToolbar ],
		toolbar: [ 'bold', 'italic', 'abbreviation', 'insertTable' ],
		table: {
			contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
		}
	} )
	.then( editor => {
		console.log( 'Editor was initialized', editor );
		CKEditorInspector.attach( editor );

		return editor;
	} )
	.then( editor => {
		const button = document.querySelector( '#say-hello' ) as HTMLButtonElement;

		button.onclick = () => {
			editor.execute( 'insertText', { text: 'Hello!' } );
		}
	} )
	.catch( error => {
		console.error( error.stack );
	} );