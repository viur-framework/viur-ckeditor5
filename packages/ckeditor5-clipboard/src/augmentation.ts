/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type {
	Clipboard,
	ClipboardPipeline,
	PastePlainText,
	DragDrop,
	DragDropTarget,
	DragDropBlockToolbar,
	ClipboardMarkersUtils
} from './index.js';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ Clipboard.pluginName ]: Clipboard;
		[ ClipboardPipeline.pluginName ]: ClipboardPipeline;
		[ ClipboardMarkersUtils.pluginName ]: ClipboardMarkersUtils;
		[ PastePlainText.pluginName ]: PastePlainText;
		[ DragDrop.pluginName ]: DragDrop;
		[ DragDropTarget.pluginName ]: DragDropTarget;
		[ DragDropBlockToolbar.pluginName ]: DragDropBlockToolbar;
	}
}
