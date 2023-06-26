//@ts-nocheck
/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { UploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKBox } from '@ckeditor/ckeditor5-ckbox';
import { CKFinder } from '@ckeditor/ckeditor5-ckfinder';
import { EasyImage } from '@ckeditor/ckeditor5-easy-image';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
	Image,
	ImageCaption,
	ImageResizeButtons,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	PictureEditing
} from '@ckeditor/ckeditor5-image';
import {Indent, IndentBlock} from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';

import { ViURUploadAdapterPlugin } from '../../viur/viur-upload-adapter'
import { ViURSchemaPlugin } from "../../viur/viur-shema";

export default class ClassicEditor extends ClassicEditorBase {
	public static override builtinPlugins = [
		Essentials,
		UploadAdapter,
		CloudServices,
		Bold,
		Italic,
		BlockQuote,
		EasyImage,
		Heading,
		Image,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		ImageResizeButtons,
		Indent,
		IndentBlock,
		Link,
		List,
		Paragraph,
		Table,
		TableToolbar,
		TextTransformation,
		Underline,
		Alignment,
		SourceEditing,
		RemoveFormat
	];

	public static override defaultConfig = {
		extraPlugins: [ViURUploadAdapterPlugin, ViURSchemaPlugin],
		toolbar: {
			items: [
				'heading',
				'|', 'bold', 'italic', 'underline',
				'|', 'alignment', 'numberedList', 'bulletedList', 'blockQuote',
				'|', 'indent', 'outdent',
				'|', 'link', 'insertTable', 'imageUpload',
				'|', 'undo', 'redo', 'RemoveFormat', 'sourceEditing'
			]
		},
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side',
				'|',
				'resizeImage:50',
	            'resizeImage:75',
	            'resizeImage:original',
				'imageTextAlternative'
			],
			resizeOptions: [
            {
                name: 'resizeImage:original',
                value: null,
                icon: 'original'
            },
            {
                name: 'resizeImage:50',
                value: '50',
                icon: 'medium'
            },
            {
                name: 'resizeImage:75',
                value: '75',
                icon: 'large'
            }
        ],
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		heading: {
            options: [
				{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
				{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
				{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
				{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
				{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
				{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
				{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
			]
        },
		alignment: {
			options: [
				{ name: 'left', className: 'viur-txt-align--left' },
				{ name: 'right', className: 'viur-txt-align--right' },
				{ name: 'center', className: 'viur-txt-align--center' },
				{ name: 'justify', className: 'viur-txt-align--justify' },
			]
		},
		indentBlock: {
            classes: [
                'viur-txt-indent--1',
                'viur-txt-indent--2',
                'viur-txt-indent--3',
                'viur-txt-indent--4',
                'viur-txt-indent--5',
                'viur-txt-indent--6',
                'viur-txt-indent--7',
                'viur-txt-indent--8',
                'viur-txt-indent--9',
                'viur-txt-indent--10',
            ]
        },

		// This value must be kept in sync with the language defined in webpack.config.js.
		language: 'de',
		viur_api_url:'http://localhost:8080'
	};
}
import '../../viur/theme.css'
