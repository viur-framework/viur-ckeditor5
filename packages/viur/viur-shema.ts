export function ViURSchemaPlugin( editor ) {

	//bold uses b Tag
	editor.conversion.attributeToElement( {
			model: 'bold',
			view: 'b',
			upcastAlso: [
				viewElement => {
					const fontWeight = viewElement.getStyle( 'font-weight' );

					if ( !fontWeight ) {
						return null;
					}

					// Value of the `font-weight` attribute can be defined as a string or a number.
					if ( fontWeight == 'bold' || Number( fontWeight ) >= 600 ) {
						return {
							name: true,
							styles: [ 'font-weight' ]
						};
					}

					return null;
				}
			]
		} )
}
