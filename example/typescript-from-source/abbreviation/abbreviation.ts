import AbbreviationEditing from './abbreviationediting';
import AbbreviationUI from './abbreviationui';
import { Plugin } from '@ckeditor/ckeditor5-core';

export default class Abbreviation extends Plugin {
    static get requires() {
        return [ AbbreviationEditing, AbbreviationUI ] as const;
    }
}