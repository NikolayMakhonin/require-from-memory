import './styles/main.scss'
import * as sapper from '../__sapper__/client.js';

sapper.start({
	target: document.querySelector('#sapper')
});