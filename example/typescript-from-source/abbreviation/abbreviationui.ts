import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui'

export default class AbbreviationUI extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'abbreviation', () => {
            const button = new ButtonView();

            button.label = 'Abbreviation';
            button.tooltip = true;
            button.withText = true;

            this.listenTo( button, 'execute', () => {
                const title = 'What You See Is What You Get';
                const abbr = 'WYSIWYG';

                editor.model.change( writer => {
                    editor.model.insertContent(
                        writer.createText( abbr, { abbreviation: title } )
                    );
                } );
            } );

            return button;
        } );
    }
}