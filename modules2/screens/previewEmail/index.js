import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	BackHandler,
	WebView,
	AsyncStorage
} from 'react-native'
import {
	Container,
	Icon
} from "../../tools/native-base";
import { HeaderNTBVNN, FooterNTBVNN } from "../../tools/native-base-vnn";
import stylevnn from '../../styles/public.js';
import { Model } from '../../Model';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;
export default class PreviewEmail extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			html: "Loading eMail...",
			data: this.props.navigation.state.params.data
		};
	}
	componentDidMount() {
		let thisSav = this;
		thisSav.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			thisSav.props.navigation.goBack();
			return true;
		});

		thisSav.willFocusSubscription = thisSav.props.navigation.addListener(
			'willFocus', () => {
				Model.mainScreen = 'PreviewEmail';
			}
		);
		
		Model.objectM.previewEmail = thisSav;
		let data = thisSav.state.data;
		data.preview = "true";
		Model.execSignalR('SendMail', data, (result) => {
			if (result != '') {
				thisSav.state.html = result;
			}
		});
	}
	PreviewEmailComplete(this_sav2, result) {
		let thisSav = this;
		thisSav.state.html = result.Message;
		thisSav.forceUpdate();
	}
	SendEmailComplete(this_sav2, result) {
		let thisSav = this;
		console.log('sm', result);
		Model.objectM.spinnerMain.close();
		if (result.Success == false) {
			Model.objectM.dialogboxMain.alert(result.Message);
		}
		else {
			AsyncStorage.setItem('cart', '[]');
			thisSav.state.dataSource = [];
			thisSav.state.count_cart = 0;
			thisSav.BackupCart(result.data_bk);
			Model.objectM.countCart = 0;
			Model.objectM.drawer.props.updateCount();
			Model.objectM.dialogboxMain.pop({
				title: null,
				content: result.Message,
				btns: [
					{
						text: 'OK',
						callback: () => {
							Model.objectM.dialogboxMain.close();
							thisSav.props.navigation.navigate('Home');
						}
					}
				]
			});
		}
	}
	BackupCart(json_data) {
		try {
			let json_arr = JSON.parse(json_data);
			AsyncStorage.getItem('cart_backup').then((response) => {
				if (response != null & response != '' & response != '[{}]') {
					let json_sp = JSON.parse(response);
					json_sp.push(
						json_arr
					);

					AsyncStorage.setItem('cart_backup', JSON.stringify(json_sp));
				}
				else {
					json_data = '[' + json_data + ']';
					AsyncStorage.setItem('cart_backup', json_data);
				}
			});
		}
		catch (r) {
			Model.objectM.dialogboxMain.alert('' + r);
		}
	}
	componentWillUnmount() {
		let thisSav = this;
		thisSav.backHandler.remove();
		thisSav.willFocusSubscription.remove();
	}
	render() {
		let thisSav = this;
		return (
			<View style={{ flex: 1 }}>
				<Container ref="myRef">
					<HeaderNTBVNN
						onLayout={(event) => {
							thisSav.setState({
								heightViewHeader: event.nativeEvent.layout.height
							})
						}}
						btnLeft={
							<TouchableOpacity
								onPress={() => {
									thisSav.props.navigation.goBack(null);
								}}
							>
								<Icon style={stylevnn.iconHeader} name="ios-arrow-round-back" />
							</TouchableOpacity>
						}
						txtMiddle={`Preview Email`}
						btnRight={null}
					/>

					<WebView
						ref={'webview'}
						source={{html: thisSav.state.html}} 
						style={{  }}
					/>

					<FooterNTBVNN
						onLayout={(event) => {
							thisSav.setState({
								heightViewFooter: event.nativeEvent.layout.height
							})
						}}
						childs={
							<View style={{ flex: 1 }}>
								<TouchableOpacity
									style={[
										stylevnn.btnFooter,
										{
											flex: 1
										}
									]}
									onPress={() => {
										Model.objectM.spinnerMain.show();
										Model.objectM.previewEmail = this;
										let dataSM =thisSav.state.data;
										dataSM.preview = "false";
										Model.execSignalR('SendMail', dataSM, (result) => {
											if (result != '') {
												Model.objectM.spinnerMain.close();
												Model.objectM.dialogboxMain.alert(result);
											}
										});
									}}
								>
									<Text style={[stylevnn.txtBtnFooter]}>
										SEND EMAIL
									</Text>
								</TouchableOpacity>
							</View>
						}
					/>
				</Container>
			</View>
		)
	}
}