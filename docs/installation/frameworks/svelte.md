---
menu-title: Svelte 3 component
category: frameworks
order: 60
---

# Svelte rich text editor component

CKEditor 5 consists of the {@link installation/getting-started/predefined-builds ready-to-use editor builds} and the {@link framework/index CKEditor 5 Framework} upon which the builds are based.

The easiest way to use CKEditor 5 in your Vue.js application is by choosing one of the {@link installation/getting-started/predefined-builds#available-builds rich text editor builds} and passing it as a prop to the Svelte component. Read more about this solution in the [Quick start](#quick-start) section of this guide.

<info-box>
 The {@link features/watchdog watchdog feature} is available for the {@link installation/frameworks/react React} and {@link installation/frameworks/angular Angular} integrations, but is not supported in Vue yet.
</info-box>

## Quick start

To use CKEditor in your Svelte application, install the [CKEditor 5 WYSIWYG editor component for Svelte](https://www.npmjs.com/package/@ckeditor/ckeditor5-svelte) and the {@link installation/getting-started/predefined-builds#available-builds editor build of your choice}.

Assuming that you used [`@ckeditor/ckeditor5-build-classic`](https://www.npmjs.com/package/@ckeditor/ckeditor5-build-classic):

```bash
npm install --save \
    @ckeditor/ckeditor5-svelte \
    @ckeditor/ckeditor5-build-classic
```

## Using the integration

Once you've installed the integration library, you now need to enable the CKEditor 5 component in your application.

To create an editor instance, first import the editor build (e.g.: from `@ckeditor/ckeditor5-build-classic` if you followed the example from the previous section) and the component and the Svelte component from the `@ckeditor/ckeditor5-vue` package.

```html
<script>
import { onMount } from 'svelte';
import { CKEditor } from '@ckeditor/ckeditor5-svelte';

let editor;

onMount(async () => {
  editor = (await import('@ckeditor/ckeditor5-build-classic')).default;
});
</script>
```

<info-box>
Currently, CKEditor builds (like `@ckeditor/ckeditor5-build-classic`) cannot be imported on the server (for example to perform Server-Side Rendering). This is caused by the side-effects the package has that depend on access to the `window` object which is only available in the browser. To work around this limitation, the example above uses dynamic import inside the `onMount` hook which is only run in the browser.
</info-box>

Now that you have all necessary pieces available, you can instantiate the component:

TODO: FIX THE #if STATEMENT BELOW.

```diff
<script>
import { onMount } from 'svelte';
import { CKEditor } from '@ckeditor/ckeditor5-svelte';

let editor;

onMount(async () => {
  editor = (await import('@ckeditor/ckeditor5-build-classic')).default;
});
</script>

+ {{}#if editor}
+   <CKEditor bind:editor />
+ {{}/if}
```

## Component props

Component accepts the following properties.

### `editor` (required)

Instance of the editor contructor. The easiest way is choosing one of the {@link installation/getting-started/predefined-builds#available-builds rich text editor builds}.

### `config`

{@link module:core/editor/editorconfig~EditorConfig Editor configuration} passed to the editor.

TODO: FIX THE #if STATEMENT BELOW.

```html
<script>
import { onMount } from 'svelte';
import { CKEditor } from '@ckeditor/ckeditor5-svelte';

let editor;
let config = {
  toolbar: [ 'bold', 'italic' ],
};

onMount(async () => {
  editor = (await import('@ckeditor/ckeditor5-build-classic')).default;
});
</script>

{{}#if editor}
  <CKEditor
    bind:editor
    bind:config
  />
{{}/if}
```

### `data`

Sets initial editor content. Updating this prop later in the lifecycle will override editor content.

TODO: FIX THE #if STATEMENT BELOW.

```html
<script>
import { onMount } from 'svelte';
import { CKEditor } from '@ckeditor/ckeditor5-svelte';

let editor;
let data = 'Hello World!';

onMount(async () => {
  editor = (await import('@ckeditor/ckeditor5-build-classic')).default;
});
</script>

{{}#if editor}
  <CKEditor
    bind:editor
    bind:data
  />
{{}/if}
```

### `disabled`

Toggles the {@link module:core/editor/editor~Editor#isReadOnly `isReadOnly`} property of the editor.

It sets the initial read–only state of the editor. Updating this prop later in the lifecycle will toggle the state.

TODO: FIX THE #if STATEMENT BELOW.

```html
<script>
import { onMount } from 'svelte';
import { CKEditor } from '@ckeditor/ckeditor5-svelte';

let editor;
let disabled = false;

onMount(async () => {
  editor = (await import('@ckeditor/ckeditor5-build-classic')).default;
});

function onClick() {
  disabled = !disabled;
}
</script>

{{}#if editor}
  <CKEditor
    bind:editor
    bind:disabled
  />
{{}/if}

<button on:click={onClick}>Toggle read-only state</button>
```

## Component events

Component exposes the following events.

### `ready`

Corresponds to the {@link module:core/editor/editor~Editor#event:ready `ready`} editor event.

```html
<CKEditor bind:editor on:ready={onReady} />
```

### `focus`

Corresponds to the {@link module:engine/view/document~Document#event:focus `focus`} editor event.

```html
<CKEditor bind:editor on:focus={onFocus} />
```

### `blur`

Corresponds to the {@link module:engine/view/document~Document#event:blur `blur`} editor event.

```html
<CKEditor bind:editor on:blur={onBlur} />
```

### `destroy`

Corresponds to the {@link module:core/editor/editor~Editor#event:destroy `destroy`} editor event.

**Note:** Because the destruction of the editor is promise–driven, this event can be fired before the actual promise resolves.

```html
<CKEditor bind:editor on:destroy={onDestroy} />
```

### `error`

Called when an error occurs during the creation or lifecycle of the CKEditor instance.

```html
<CKEditor bind:editor on:error={onError} />
```
