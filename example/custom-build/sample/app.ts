import ClassicEditor from '../build/ckeditor';

ClassicEditor
    .create(document.querySelector('.editor') as HTMLElement, {
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
    })
    .catch(error => {
        console.error('Oops, something went wrong!');
        console.error('Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:');
        console.warn('Build id: 6uafq7eqsl8m-tmctzeihrjkf');
        console.error(error);
    });
