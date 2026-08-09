import { Dimensions } from 'react-native';
import { Model } from './Model';
let { height } = Dimensions.get("window");


function getDevice() {
	let zoom = false;
	if(height <= 580) {
		zoom = true;
	}
	return zoom;
}

function refreshPage(page, data, goback) {
	Model.navigatePublic.navigation.navigate(page, { data:data, goback:goback })
}

function getnow() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	return today = dd+'/'+mm+'/'+yyyy;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function convertstr_date(str) {
	str = str.split('/');
	str = str[2] + '-' + str[1] + '-' + str[0];
	return new Date(str);
}

export {
    refreshPage,
	getnow,
	guid,
	convertstr_date,
	getDevice
};