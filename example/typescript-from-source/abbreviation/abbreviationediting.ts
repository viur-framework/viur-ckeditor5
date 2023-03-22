import { Plugin } from '@ckeditor/ckeditor5-core';
import { ViewElement } from '@ckeditor/ckeditor5-engine'

export default class AbbreviationEditing extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();
    }

    private _defineSchema() {
        const schema = this.editor.model.schema;

        schema.extend( '$text', {
            allowAttributes: [ 'abbreviation' ]
        } );
    }

    private _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for( 'downcast' ).attributeToElement( {
            model: 'abbreviation',
            view: ( modelAttributeValue, conversionApi ) => {
                const { writer } = conversionApi;

                return writer.createAttributeElement( 'abbr', {
                    title: modelAttributeValue
                } );
            }
        } );

        conversion.for( 'upcast' ).elementToAttribute( {
            view: {
                name: 'abbr',
                attributes: [ 'title' ]
            },
            model: {
                key: 'abbreviation',
                value: ( viewElement: ViewElement ) => {
                    const title = viewElement.getAttribute( 'title' );

                    return title;
                }
            }
        } );
    }
}