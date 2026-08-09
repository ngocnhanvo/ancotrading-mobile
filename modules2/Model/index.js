import {
	PermissionsAndroid,
	Platform,
	View,
	Dimensions,
	NativeModules,
	FlatList
} from "react-native";
import { SignalRFunc } from '../SignalR';
import ImageViewer from '../react-native-image-zoom-viewer';
import AsyncStorage from "@react-native-async-storage/async-storage";
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;
class Model {
	
	//#region Server
	static localIp = 'ancotrading.ancopottery.com.vn';
	static publicIp = 'ancotrading.ancopottery.com.vn';
	static appPool = 'ancotrading';
	static NameIp = () => {
		return `ANCO`;
	}
	static companyInfo = {
		name: `ANCO Company Ltd`,
		address: `3B/2, Quarter 1B, An Phu Ward, Ho Chi Minh City, Vietnam`,
		email: `Email: anco@ancopottery.com`,
		employee: `Contact person:`,
		employeeVal: `Unknown`
	}
	//#endregion

	//#region AsyncStorage
	static nhanvien = 'nhanvien';
	static headerH = 50;
	static footerH = 50;
	static paginationH = 60;
	static NumericInputH = 40;
	static NumericInputW = deviceWidth/2;
	static minVal = 1;
	static maxVal = 99999999;
	static getColorsAndSizes = (datas, res) => {
		for(let i in datas) {
			let data = datas[i];
			for(let j in res.colors) {
				let color = res.colors[j];
				if(color.itemNo == data.itemNo) {
					for (const key in data) {
						if (color.hasOwnProperty(key)) {
							//if(key != "sizes")
								color[key] = data[key];
							// else {
							// 	for(let jS in color.sizes) {
							// 		let sizeS = color.sizes[jS];
							// 		let dataS = datas.filter((s)=> {return s.itemNo == sizeS.itemNo})[0];
							// 		for (const keyS in dataS) {
							// 			if (sizeS.hasOwnProperty(keyS) & keyS != "image")
							// 				sizeS[keyS] = dataS[keyS];
							// 		}

							// 		// for(let jSS in sizeS.sizes) {
							// 		// 	let sizeSS = sizeS.size[jSS];
							// 		// 	let dataSS = datas.filter((s)=> {return s.itemNo == sizeSS.itemNo})[0];
							// 		// 	for (const keySS in dataSS) {
							// 		// 		if (sizeSS.hasOwnProperty(keySS) & keySS != "image")
							// 		// 			sizeSS[keySS] = dataSS[keySS];
							// 		// 	}	
							// 		// }
							// 	}
							// }
						}
					}
				}
			}

			for(let j in res.sizes) {
				let size = res.sizes[j];
				if(size.itemNo == data.itemNo) {
					for (const key in data) {
						if (size.hasOwnProperty(key)) {
							if(key != "sizes")
								size[key] = data[key];
							else {
								for(let jS in size.sizes) {
									let sizeS = size.sizes[jS];
									let dataS = datas.filter((s)=> {return s.itemNo == sizeS.itemNo})[0];
									for (const keyS in dataS) {
										if (sizeS.hasOwnProperty(keyS) & keyS != "image")
											sizeS[keyS] = dataS[keyS];
									}
								}
							}
						}
					}
				}
			}
		}

		return res;
	}
	static is0orS = (itemNo, pc) => { 
		let aVal = itemNo.substr(9,2);
		if(pc)
			return aVal.startsWith('0') | aVal == "S1" | /^[a-zA-Z]{2}$/.test(aVal); 

		return aVal.startsWith('S') & aVal != "S1" & !/^[a-zA-Z]{2}$/.test(aVal); 
	}
	static getSizeSets = (sizesMain) => {
		const condition = (a) => { 
			let aVal = a.itemNo;
			return Model.is0orS(aVal, false) | Model.is0orS(aVal, true)
		};
		let sizes = sizesMain.filter((a) => { return condition(a) });
		let sets = sizesMain.filter((a) => { return !condition(a) });
		sets.unshift({itemNo: `Please select an option`,sizes: [], type: 0});
		return {sizes, sets};
	}
	static toNumber = (a) => {
		return Number(a.replace(/\,/g, ''));
	}
	static toNumberStr = (a) => {
		return a.toLocaleString('en-US');
	}
	static qoTypes = [{id: 0, value: 'Without price'}, {id: 1, value: 'With price'}];
	static screenAfterKill = 'screenAfterKill';
	static removeScreenAfterKill  = (callback) => {
		const json = {screen: null, state: null};
		let str = JSON.stringify(json);
		Model.saveScreenAfterKill(str, () => {
			if(callback)
				callback();
		});
	}
	static saveScreenAfterKill = (json, callback) => {
		let str = JSON.stringify(json);
		AsyncStorage.setItem(Model.screenAfterKill, str, () => {
			if(callback)
				callback();
		});
	}
	static loadScreenAfterKill = (callback) => {
		AsyncStorage.getItem(Model.screenAfterKill).then((str) => {
			let json = {screen: null};
			if(str)
				json = JSON.parse(str);
			callback(json);
		});
	}
	static activeSplashScreen = (show) => {
		setTimeout(()=>{
			if(show)
				NativeModules.SplashScreen.show();
			else
				NativeModules.SplashScreen.hide();
		}, 1000);
	}
	static ScrollView = ({children}) => {
		return (
			<FlatList
				data={[]}
				keyExtractor={() => "key"}
				renderItem={null}
				ListHeaderComponent={
					<>{children}</>
				}
			/>
		)
	}
	//#endregion

	static linkRoot = `https://${Model.localIp}/${Model.appPool}`;
	static linkSignalR = `${Model.linkRoot}/signalr`;
	static linkImage = `${Model.linkRoot}/images/products/fullsize`;
	
	static updateLinkRoot(ip) {
		Model.linkRoot = `https://${ip}/${Model.appPool}`;
		Model.updateLinkRootReference(Model.linkRoot);
	}
	static updateLinkRootReference(linkRoot) {
		Model.linkSignalR = `${linkRoot}/signalr`;
		Model.linkImage = `${linkRoot}/images/products/fullsize`;
	}
	static objectM = {
		screen: null,
		countCart: (count_cart) => {
			if(count_cart <= 0)
				count_cart = null;
			else
				count_cart + '';
			return count_cart;
		},
		viewIMG: (image, dialog) => {
			dialog.pop({
				vnnType: 1,
				title: null,
				content: (
					<View style={{ width: 300, maxHeight: 300, flex: 1 }}>
						<ImageViewer 
							imageUrls={[{ url: `data:image/jpeg;base64,${image}` }]} 
						/>
					</View>
				),
				btns: [
					{
						text: 'Cancel',
						callback: () => {
							dialog.disableOverlayClickClose(false);
							dialog.close();
						}
					}
				]
			});
		}
	};
	//#region API
	static ProxySignalR = null;
	static ConnectSignalR = null;
	static Sentry = null;
	static mainScreen = '';
	
	static execSignalR = (name, jsonStr, callback) => {
		let execSignalRR = () => {
			const stateR = Model.ConnectSignalR.state;
			const execCommand = function (callback2) {
				Model.ProxySignalR.invoke(name, jsonStr)
					.done((result) => {
						callback2('');
					}).fail((error) => {
						callback2('' + error);
					});
			};

			if (stateR == 1) {
				execCommand((rs)=>{
					callback(rs);
				});
			}
			else {
				Model.ConnectSignalR.start().done(() => {
					execCommand((rs)=>{
						callback(rs);
					});
				}).fail(() => {
					Model.ConnectSignalR.stop();
					callback('Connect fail to server: ' + Model.NameIp());
				});
			}
		}

		if (!Model.ConnectSignalR) {
			SignalRFunc.connectSignalR(null, (result) => {
				if (result.length > 0) {
					callback(result);
				}
				else {
					execSignalRR();
				}
			});
		}
		else {
			execSignalRR();
		}
	}
	static isValidEmail(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}

	static navigatePublic = null;

	static getRegionForCoordinates(points) {
		// points should be an array of { latitude: X, longitude: Y }
		let minX, maxX, minY, maxY;

		// init first point
		((point) => {
			minX = point.latitude;
			maxX = point.latitude;
			minY = point.longitude;
			maxY = point.longitude;
		})(points[0]);

		// calculate rect
		points.map((point) => {
			minX = Math.min(minX, point.latitude);
			maxX = Math.max(maxX, point.latitude);
			minY = Math.min(minY, point.longitude);
			maxY = Math.max(maxY, point.longitude);
		});

		const midX = (minX + maxX) / 2;
		const midY = (minY + maxY) / 2;
		const deltaX = (maxX - minX);
		const deltaY = (maxY - minY);

		return {
			latitude: midX,
			longitude: midY,
			latitudeDelta: deltaX,
			longitudeDelta: deltaY
		};
	}
	//#endregion API

	//#region Information public App
	static backGround = require("../images/backgroundSideBar.png");
	static Avatar = require("../images/Avatar404.jpg");
	static UserName = "";
	static PassWord = "";
	static UserFullName = "";
	static MaKH = "";
	static logoHeader = require("../images/LogoAnco.png");
	static logoHeaderDetail = "";
	static BannerHome = "";
	static btnsHome = {
		btn01: require("../images/btns/icon01.jpg"),
		btn02: require("../images/btns/icon02.jpg"),
		btn03: require("../images/btns/icon03.jpg"),
		btn04: require("../images/btns/icon04.jpg")
	};

	static IconContent = {
		size: 68,
		color: '#2ec19c',
		text: {
			size: 24,
			color: '#00a539'
		}
	};

	//#endregion Information public App
	static HomeContent = [];

	static checkLockScreen = () => {
		let isVisible = false;
		if(Model.objectM.dialogboxMain)
			isVisible = Model.objectM.dialogboxMain.state.isVisible;

		if(!isVisible) {
			if(Model.objectM.dialogboxMain2)
				isVisible = Model.objectM.dialogboxMain2.state.isVisible;
		}

		if(!isVisible) {
			if(Model.objectM.spinnerMain)
				isVisible = Model.objectM.spinnerMain.state.visible;
		}

		return isVisible;
	};

	static timSoChiaHet(sobichia, sochia, order) {
		if (sobichia % sochia === 0) {
			return sobichia;
		}
		else {
			sobichia++;
			return Model.timSoChiaHet(sobichia, sochia, order);
		}
	}
	static convertTable(data, sep) {
		var table = [];
		var rows = [];
		var length = Model.timSoChiaHet(data.length, sep, 'asc');
		for (var i = 0; i < length; i++) {
			rowsel = data[i];
			if (rowsel == null) {
				rowsel = {
					index: -1,
					name: '',
					title: '',
					icon: ''
				};
			}

			if ((i + 1) % sep === 0) {
				rows.push(rowsel);
				table.push(rows);
				rows = [];
			}
			else {
				rows.push(rowsel);
			}
		}
		return table;
	}

	static async requestPermission() {
		if (Platform.OS === "android") {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.CAMERA
				)
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					//alert("You can use camera");
				} else {
					alert("Camera permission denied");
				}
			} catch (err) {
				console.warn(err)
			}
		}
	}
}

export {
	Model
};
