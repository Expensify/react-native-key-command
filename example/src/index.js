import {AppRegistry} from 'react-native';
import App from './App';

const runApplication = () => {
    AppRegistry.registerComponent('App', () => App);
    AppRegistry.runApplication('App', {rootTag: document.getElementById('root')});
};

runApplication();
