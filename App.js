import React from "react";
import {
	StatusBar,
  	NativeModules,
  	Dimensions,
	AppState
} from "react-native";
import {
	Root, View
} from "./modules2/tools/native-base";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DialogBox from './modules2/tools/react-native-dialogbox';
import NotificationPopup from './modules2/tools/react-native-push-notification-popup';
import Spinner from './modules2/tools/react-native-loading-spinner-overlay';
import { Model } from "./modules2/Model";
import { AppFunc } from "./modules2/AppFunc";
let sizeScreen = Dimensions.get("window");
const deviceWidth = sizeScreen.width;
export default class App extends React.Component {
  	render() {
		let this_sav = this;
		let AppNavigator = AppFunc.AppNavigatorF(this_sav);
		let render = (
			<View style={{flex:1}}>
				<AppNavigator />
			</View>
		);

		Model.mainScreen = 'Home';
		let AppNavigatorDrawer = AppFunc.DrawerF(this_sav, this_sav.props, "", render);

		try {
			return (
				<SafeAreaProvider>
				<Root>
					<StatusBar hidden={true} />
					{AppNavigatorDrawer}
					<NotificationPopup ref={ref => this.popupMain = ref} />
					
					<DialogBox
						vnnType={1}
						style={
							{
								zIndex: 2,
								position: 'absolute',
								width: '100%'
							}
						}
						isOverlayClickClose={
							true
						}
						ref={
							dialogbox => {
								Model.objectM.dialogboxMain2 = dialogbox
							}
						}
					/>
					<DialogBox
						vnnType={1}
						style={
							{
								zIndex: 3,
								position: 'absolute'
							}
						}
						isOverlayClickClose={
							true
						}
						ref={
							dialogbox => {
								Model.objectM.dialogboxMain3 = dialogbox
							}
						}
					/>
					<DialogBox
						vnnType={1}
						style={
							{
								zIndex: 4,
								position: 'absolute'
							}
						}
						isOverlayClickClose={
							true
						}
						ref={
							dialogbox => {
								Model.objectM.dialogboxMain4 = dialogbox
							}
						}
					/>
					<DialogBox
						style={
							{
								zIndex: 99999,
								position: 'absolute'
							}
						}
						isOverlayClickClose={
							true
						}
						ref={
							dialogbox => {
								Model.objectM.dialogboxMain = dialogbox
							}
						}
					/>
					<Spinner
						ref={
							spinner => {
								Model.objectM.spinnerMain = spinner
							}
						}
						textContent={" "}
						textStyle={{ color: '#FFF' }}
					/>
				</Root>
				</SafeAreaProvider>
			)
		}
		catch (err) {
			//Model.Sentry.captureException(err);
			throw new Error(err);
		}
	}
	componentDidMount() {
		// Lắng nghe sự kiện AppState
        AppState.addEventListener('change', this._handleAppStateChange);
	}
	componentWillUnmount () {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}
	_handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
			Model.keepAlive = true;
			if(Model.mainScreen) {
				if(Model.mainScreen == 'Cart') {
					let savData = {};
					let formData = Model.formCrt.state.mainData;
					for(const key in formData) {
						savData[key] = Model.formCrt.state[key];
					}
					savData.keepAlive = true;

					const savJS = {
						screen: Model.mainScreen, 
						state: savData
					};
					Model.saveScreenAfterKill(savJS);
				}
			}
        }
		else if (nextAppState == 'active') {
			if(Model.keepAlive) {
				Model.keepAlive = null;
				Model.removeScreenAfterKill();
			}
		}
    };
}