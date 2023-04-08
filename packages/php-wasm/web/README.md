# WebAssembly PHP for the web

This package ships WebAssembly PHP binaries and the JavaScript API optimized for the web and a low bundle size. It comes with the Libzip extension and the SQLite extension.

Here's how to use it:

```js
import {
	loadPHPRuntime,
	getPHPLoaderModule,
	PHP,
	PHPServer,
} from '@php-wasm/web';
const php = new PHP(
	// getPHPLoaderModule() calls import('php.wasm') internally
	// Your bundler must resolve import('php.wasm') as a static file URL.
	// If you use Webpack, you can use the file-loader to do so.
	await loadPHPRuntime(await getPHPLoaderModule('8.0'))
);

// Create and run a script directly
php.mkdirTree('/www');
php.writeFile('/www/index.php', `<?php echo "Hello " . $_POST['name']; ?>`);
php.run({ scriptPath: '/www/index.php' });

// Or use the familiar HTTP concepts:
const server = new PHPServer(php, { documentRoot: '/www' });
const response = server.request({
	method: 'POST',
	relativeUrl: '/index.php',
	data: { name: 'John' },
});
```