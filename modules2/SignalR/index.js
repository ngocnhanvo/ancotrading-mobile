import React from "react";
import { Model } from "../Model";
import DialogBox from '../tools/react-native-dialogbox';
import Spinner from '../tools/react-native-loading-spinner-overlay';
import FontAwesome from '../tools/winta-font-awesome';
import RNExitApp from 'react-native-exit-app';
import signalr from '../react-native-signalr';
import {
	View,
	Text,
	AsyncStorage as WintaStorage,
	Platform,
	ScrollView,
	Dimensions,
	TextInput
} from "react-native";
import {
	Button
} from "../native-base-theme/components";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

class SignalRFunc {
	constructor() {

	}
	static connectSignalR(this_sav, callback) {
		let result00 = '-1';
		const connection = signalr.hubConnection(Model.linkSignalR);

		Model.ConnectSignalR = connection;
		Model.ProxySignalR = connection.createHubProxy('mainhubphone');
		//#region ProxySignalR
		Model.ProxySignalR.off('Login');
		Model.ProxySignalR.on('Login', (result) => {
			if(Model.objectM.screen)
				Model.objectM.screen.Login_Complete(result);
			else {
				Model.objectM.dialogboxMain.alert('error (Model.objectM.screen is not found)');
				Model.objectM.spinnerMain.close();
			}
		});

		Model.ProxySignalR.off('QOPOexcute');
		Model.ProxySignalR.on('QOPOexcute', (result) => {
			if(Model.footerQuo)
				Model.footerQuo.QOPOexcuteComplete(result);
			else {
				Model.objectM.dialogboxMain.alert('error (Model.footerQuo is not found)');
				Model.objectM.spinnerMain.close();
			}
		});

		Model.ProxySignalR.off('PreviewEmail');
		Model.ProxySignalR.on('PreviewEmail', (result) => {
			Model.objectM.previewEmail.PreviewEmailComplete(this_sav, result);
		});

		Model.ProxySignalR.off('SendEmail');
		Model.ProxySignalR.on('SendEmail', (result) => {
			console.log('SendEmail', result);
			Model.objectM.previewEmail.SendEmailComplete(this_sav, result);
		});
		//#endregion ProxySignalR

		connection.start().done(() => {
			result00 = '';
		}).fail((err) => {
			connection.stop();
			result00 = 'Connect fail to server: ' + Model.NameIp();
		});

		connection.connectionSlow(() => {
			connection.stop();
			result00 = 'Connect slow to server: ' + Model.NameIp();
		});

		connection.error((error) => {
			const errorMessage = error.message;
			let detailedError = '';
			if (error.source && error.source._response) {
				detailedError = error.source._response;
			}

			if (detailedError === 'An SSL error has occurred and a secure connection to the server cannot be made.') {
				detailedError = 'When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14';
			}
			else {
				if (detailedError.indexOf('Runtime Error') < 0) {
					connection.stop();
					result00 = detailedError;
				}
				else {
					result00 = detailedError;
				}
			}
		});

		let time = 0;
		let Interval = setInterval(function () {
			if (result00 != '-1') {
				clearInterval(Interval);
				callback(result00);
			}
			else if(time > 100) {
				clearInterval(Interval);
				callback('Timeout! (over 10 second)');
				time = 0;
				Model.objectM.spinnerMain.close();
			}
			else {
				time++;
			}
		}, 100);
	}


	static jsonSavSignal(callback) {
		WintaStorage.getItem('jsonSav').then((jsonSav) => {
			var checkLogin = false;
			if (jsonSav != null & jsonSav != '') {
				try {
					jsonSav = JSON.parse(jsonSav);
					Model.UserName = jsonSav.UserName;
					Model.HomeContent = jsonSav.HomeContent;
					checkLogin = true;
				}
				catch (r) { }
			}

			callback(checkLogin);
		});
	}

	static ExecJsonSavSignal(this_sav, callback) {
		SignalRFunc.jsonSavSignal((res) => {
			SignalRFunc.connectSignalR(this_sav, (result) => {
				if (result != '') {
					if (result.indexOf('Runtime Error') < 0) {
						this_sav.setState({
							errorServer: result
						});
					}
				}
				//else {
					// if(res == true)
					// 	this_sav.setState({initRoute:'Drawer', errorServer: ''});
					// else
					//this_sav.setState({ initRoute: 'Login', errorServer: '' });
				//}
				callback(result);
			});
		});
	}

	static ResultJsonSavSignal(this_sav) {
		Model.objectM.spinnerMain.show();
		SignalRFunc.ExecJsonSavSignal(this_sav, (result) => {
			Model.objectM.spinnerMain.close();
			if (result != '') {
				if (result.indexOf('Runtime Error') < 0) {
					Model.objectM.dialogboxMain.alert(result);
				}
			}
		})
	}

	static ThietLapLaiServer(this_sav) {
		this_sav.setState({ ipDomain: Model.linkRoot }, () => {
			Model.objectM.dialogboxMain.pop({
				title: 'Thiết lập kết nối tới server',
				vnnType: 1,
				content: (
					<TextInput
						onChangeText={(text) => { this_sav.setState({ ipDomain: text }) }}
						defaultValue={this_sav.state.ipDomain}
						style={{ height: Platform.OS === "ios" ? 30 : 50, width: null, alignSelf: 'stretch', backgroundColor: '#CCC', textAlign: 'center' }}
						placeholderTextColor="rgba(255,255,255,0.7)"
						placeholder="Nhập IP hoặc Domain của Server"
						underlineColorAndroid="transparent"
						returnKeyType="go"
					/>
				),
				btns: [
					{
						text: 'Đồng ý',
						callback: () => {
							Model.objectM.dialogboxMain.close();
							WintaStorage.setItem('serverIP', this_sav.state.ipDomain);
							Model.linkRoot = this_sav.state.ipDomain;
							Model.updateLinkRoot();
							SignalRFunc.ResultJsonSavSignal(this_sav);
						}
					},
					{
						text: 'Thoát',
						callback: () => {
							Model.objectM.dialogboxMain.close();
						}
					}
				]
			})
		});
	}

	static ThietLapLaiServerView(this_sav) {
		return (
			<ScrollView>
				<View style={{ flex: 1, position: 'relative', zIndex: 0, justifyContent: 'center', alignItems: 'center', height: deviceHeight - 30 }}>
					<FontAwesome name="ion-md-sad" style={{ textAlign: 'center', color: '#CCC', fontSize: 120, marginBottom: 2 }} />
					<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>You have an error</Text>
					<Text style={{ marginBottom: 20, textAlign: "center" }}>{this_sav.state.errorServer}</Text>
					<View style={{ width: deviceWidth, marginBottom: 20 }}>
						<Button style={{ padding: 10, zIndex: 0 }} light full
							onPress={() => {
								Model.updateLinkRoot(Model.publicIp);
								SignalRFunc.ResultJsonSavSignal(this_sav);
							}}
						>
							<Text style={{ color: 'green', fontWeight: 'bold' }}>
								Connect to Public IP
							</Text>
						</Button>
					</View>
					<View style={{ width: deviceWidth, marginBottom: 20 }}>
						<Button style={{ padding: 10, zIndex: 0 }} light full
							onPress={() => {
								SignalRFunc.ResultJsonSavSignal(this_sav);
							}}>
							<Text style={{ color: 'green', fontWeight: 'bold' }}>
								Connect again
							</Text>
						</Button>
					</View>
					<View style={{ width: deviceWidth }}>
						<Button style={{ padding: 10, zIndex: 0 }} light full
							onPress={() => { RNExitApp.exitApp() }}>
							<Text style={{ color: 'green', fontWeight: 'bold' }}>
								Exit app
							</Text>
						</Button>
					</View>
				</View>
				<Spinner
					ref={
						spinner => {
							Model.objectM.spinnerMain = spinner
						}
					}
					textContent={" "}
					textStyle={{ color: '#FFF' }}
				/>

				<DialogBox
					style={{ top: 50 }}
					isOverlayClickClose={
						true
					}
					ref={
						dialogbox => {
							Model.objectM.dialogboxMain = dialogbox
						}
					}
				/>
			</ScrollView>
		)
	}
}

export {
	SignalRFunc
};
