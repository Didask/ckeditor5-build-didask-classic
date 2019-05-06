/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals document */

import DidaskClassicEditor from '../src/ckeditor';
import BaseClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { describeMemoryUsage, testMemoryUsage } from '@ckeditor/ckeditor5-core/tests/_utils/memory';

describe( 'DidaskClassicEditor build', () => {
	let editor, editorElement;

	beforeEach( () => {
		editorElement = document.createElement( 'div' );
		editorElement.innerHTML = '<p><strong>foo</strong> bar</p>';

		document.body.appendChild( editorElement );
	} );

	afterEach( () => {
		editorElement.remove();
		editor = null;
	} );

	describe( 'build', () => {
		it( 'contains plugins', () => {
			expect( DidaskClassicEditor.builtinPlugins ).to.not.be.empty;
		} );

		it( 'contains config', () => {
			expect( DidaskClassicEditor.defaultConfig.toolbar ).to.not.be.empty;
		} );
	} );

	describe( 'create()', () => {
		beforeEach( () => {
			return DidaskClassicEditor.create( editorElement )
				.then( newEditor => {
					editor = newEditor;
				} );
		} );

		afterEach( () => {
			return editor.destroy();
		} );

		it( 'creates an instance which inherits from the DidaskClassicEditor', () => {
			expect( editor ).to.be.instanceof( DidaskClassicEditor );
			expect( editor ).to.be.instanceof( BaseClassicEditor );
		} );

		it( 'loads data from the editor element', () => {
			expect( editor.getData() ).to.equal( '<p><strong>foo</strong> bar</p>' );
		} );
	} );

	describe( 'destroy()', () => {
		beforeEach( () => {
			return DidaskClassicEditor.create( editorElement )
				.then( newEditor => {
					editor = newEditor;
				} );
		} );

		it( 'sets the data back to the editor element', () => {
			editor.setData( '<p>foo</p>' );

			return editor.destroy()
				.then( () => {
					expect( editorElement.innerHTML ).to.equal( '<p>foo</p>' );
				} );
		} );

		it( 'restores the editor element', () => {
			expect( editor.sourceElement.style.display ).to.equal( 'none' );

			return editor.destroy()
				.then( () => {
					expect( editor.sourceElement.style.display ).to.equal( '' );
				} );
		} );
	} );

	describe( 'plugins', () => {
		beforeEach( () => {
			return DidaskClassicEditor.create( editorElement )
				.then( newEditor => {
					editor = newEditor;
				} );
		} );

		afterEach( () => {
			return editor.destroy();
		} );

		it( 'paragraph works', () => {
			const data = '<p>Some text inside a paragraph.</p>';

			editor.setData( data );
			expect( editor.getData() ).to.equal( data );
		} );

		it( 'basic-styles work', () => {
			const data = [
				'<p>',
				'<strong>Test:strong</strong>',
				'<i>Test:i</i>',
				'</p>'
			].join( '' );

			editor.setData( data );
			expect( editor.getData() ).to.equal( data );
		} );

		it( 'block-quote works', () => {
			const data = '<blockquote><p>Quote</p></blockquote>';

			editor.setData( data );
			expect( editor.getData() ).to.equal( data );
		} );

		it( 'heading works', () => {
			const data = [
				'<h2>Heading 1.</h2>',
				'<h3>Heading 1.1</h3>',
				'<h4>Heading 1.1.1</h4>',
				'<h4>Heading 1.1.2</h4>',
				'<h3>Heading 1.2</h3>',
				'<h4>Heading 1.2.1</h4>',
				'<h2>Heading 2</h2>'
			].join( '' );

			editor.setData( data );
			expect( editor.getData() ).to.equal( data );
		} );

		it( 'image works', () => {
			const data = '<figure class="image"><img src="./manual/sample.jpg"></figure>';

			editor.setData( data );
			expect( editor.getData() ).to.equal( data );
		} );

		it( 'list works', () => {
			const data = [
				'<ul>',
				'<li>Item 1.</li>',
				'<li>Item 2.</li>',
				'</ul>',
				'<ol>',
				'<li>Item 1.</li>',
				'<li>Item 2.</li>',
				'</ol>'
			].join( '' );

			editor.setData( data );
			expect( editor.getData() ).to.equal( data );
		} );

		it( 'link works', () => {
			const data = '<p><a href="//ckeditor.com">CKEditor.com</a></p>';

			editor.setData( data );
			expect( editor.getData() ).to.equal( data );
		} );
	} );

	describe( 'config', () => {
		afterEach( () => {
			return editor.destroy();
		} );

		// https://github.com/ckeditor/ckeditor5/issues/572
		it( 'allows configuring toolbar items through config.toolbar', () => {
			return DidaskClassicEditor
				.create( editorElement, {
					toolbar: [ 'bold' ]
				} )
				.then( newEditor => {
					editor = newEditor;

					expect( editor.ui.view.toolbar.items.length ).to.equal( 1 );
				} );
		} );

		// https://github.com/ckeditor/ckeditor5/issues/572
		it( 'allows configuring toolbar offset without overriding toolbar items', () => {
			return DidaskClassicEditor
				.create( editorElement, {
					toolbar: {
						viewportTopOffset: 42
					}
				} )
				.then( newEditor => {
					editor = newEditor;

					expect( editor.ui.view.toolbar.items.length ).to.equal( 13 );
					expect( editor.ui.view.stickyPanel.viewportTopOffset ).to.equal( 42 );
				} );
		} );
	} );

	describeMemoryUsage( () => {
		testMemoryUsage(
			'should not grow on multiple create/destroy',
			() => DidaskClassicEditor.create( document.querySelector( '#mem-editor' ) ) );
	} );
} );
