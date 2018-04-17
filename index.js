const menubar = require('menubar');
const dir = process.cwd();
const mb = menubar({
	index: `file://${dir}/public/index.html`
});

mb.on('ready', () => {
	console.log('hello');
});
