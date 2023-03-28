/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table } from '@ckeditor/ckeditor5-table';

class Editor extends ClassicEditor {
	// Plugins to include in the build.
	static override builtinPlugins = [
		Bold,
		Essentials,
		Italic,
		Paragraph,
		Table
	];

	// Editor configuration.
	static override defaultConfig = {
		toolbar: {
			items: [
				'bold',
				'italic',
				'|',
				'insertTable',
				'undo',
				'redo'
			]
		},
		language: 'en'
	};
}

export default Editor;
