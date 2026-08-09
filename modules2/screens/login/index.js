import React, { Component } from 'react';
import { Model } from '../../Model';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	KeyboardAvoidingView,
	ScrollView
} from 'react-native';
import {
	Container,
	Form,
	Icon,
	Label,
	Item,
	Input
} from "../../tools/native-base";
import { HeaderNTBVNN, FooterNTBVNN } from "../../tools/native-base-vnn";
import stylevnn from '../../styles/public';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

//avariable
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class LoginPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: '',
			isPasswordSecure: true
		}
	}
	Login() {
		let this_sav = this;
		let data = {
			Username: this_sav.state.username.trim(),
			Password: this_sav.state.password.trim()
		};

		if(data.Username.replace(/ /g,'').length <= 0) {
			Model.objectM.dialogboxMain.alert('Username is incorrect');
			return;
		}

		if(data.Password.replace(/ /g,'').length <= 0) {
			Model.objectM.dialogboxMain.alert('Password is incorrect');
			return;
		}

		Model.objectM.spinnerMain.show();
		Model.objectM.screen = this_sav;
		Model.execSignalR('Login', data, (result) => {
			if (result != '') {
				Model.objectM.spinnerMain.close();
				Model.objectM.dialogboxMain.alert(result);
			}
		});
	}
	Login_Complete(result) {
		let this_sav = this;
		if(Model.objectM.spinnerMain)
			Model.objectM.spinnerMain.close();
		
		if (result.Success == true) {
			try {
				let js_res = JSON.parse(result.Message)[0];
				if (js_res.status == "true") {
					Model.UserName = js_res.user;
					Model.UserFullName = js_res.name;
					Model.PassWord = js_res.key;
					AsyncStorage.setItem(Model.nhanvien, JSON.stringify(js_res), () => {
						Model.objectM.sidebar.setUser();
						Model.objectM.dialogboxMain.disableOverlayClickClose(true);
						Model.objectM.dialogboxMain.pop({
							title: 'The login was successful',
							vnnType: 1,
							content: (
								<View>
									<Text style={{color:'#000'}}>Back to the previous page</Text>
								</View>
							),
							btns: [
								{
									text: 'OK',
									callback: () => {
										Model.objectM.dialogboxMain.disableOverlayClickClose(false);
										Model.objectM.dialogboxMain.close();
										this_sav.props.navigation.goBack();
										//this_sav.props.navigation.navigate("Quotation", { data: ''});
									}
								}
							]
						});
					});
				}
				else {
					Model.objectM.dialogboxMain.alert('Invalid Username or Password');
				}
			}
			catch (error1) {
				Model.objectM.dialogboxMain.alert(error1 + '');
			}
		}
		else {
			Model.objectM.dialogboxMain.tip({
				title: 'Login fail',
				content: result.Message
			});
		}
	}
	componentDidMount() {
		let this_sav = this;
		Model.this_sav = this_sav;
		Model.navigatePublic = this_sav.props;
		Model.mainScreen = Model.navigatePublic.navigation.state.routeName;
	}
	UNSAFE_componentWillMount() {
		let this_sav = this;
		this_sav.willFocusSubscription = this_sav.props.navigation.addListener(
			'willFocus', () => {
				Model.this_sav = this_sav;
				Model.navigatePublic = this_sav.props;
				Model.mainScreen = Model.navigatePublic.navigation.state.routeName;
			}
		);
	}
	componentWillUnmount() {
		this.willFocusSubscription.remove();
	}
	render() {
		let this_sav = this;
		return (
			<Container ref="myRef" style={[styles.container, stylevnn.container]}>
				<HeaderNTBVNN 
					btnLeft={
						<TouchableOpacity
							onPress={() => {
								this_sav.props.navigation.goBack(null);
							}}
						>
							<Icon style={stylevnn.iconHeader} name="ios-arrow-round-back" />
						</TouchableOpacity>
					}
					txtMiddle={`Login`}
					btnRight={
						<TouchableOpacity
							onPress={() => {
								this.props.navigation.navigate("Home", { data: ''})
							}}
						>
							<Icon style={stylevnn.iconHeader} name="home" />
						</TouchableOpacity>
					}
				/>

				<KeyboardAvoidingView behavior="padding" style={{ flex: 1  }}>
					<ScrollView>
						<Form style={{ paddingBottom: 10, paddingTop: 10, paddingRight: 10, height: '100%' }}>						
							<Item stackedLabel last>
								<Label>User Name</Label>
								<Input onChangeText={(text) => this.setState({ username: text })} value={this.state.username} />
							</Item>

							<Item stackedLabel last>
								<Label>Password</Label>
								<Input
									secureTextEntry={this_sav.state.isPasswordSecure}
									onChangeText={(text) => this.setState({ password: text })} 
									value={this_sav.state.password} 
								/>
								<Icon
									style={{
										position: 'absolute',
										right: 0,
										zIndex: 9999
									}}
									name={this_sav.state.isPasswordSecure ? "eye" : "eye-off"}
									onPress={() => { 
										this_sav.setState({isPasswordSecure: !this_sav.state.isPasswordSecure});
									}}
								/>
							</Item>
						</Form>
					</ScrollView>
				</KeyboardAvoidingView>

				<FooterNTBVNN
					onLayout={(event) => {
						this_sav.setState({
							heightViewFooter: event.nativeEvent.layout.height
						})
					}}
					childs={
						<TouchableOpacity 
							style={[
								stylevnn.btnFooter,
								{
									flex: 1
								}
							]} 
							onPress={() => {
								this_sav.Login();
							}}
						>
							<Text style={[stylevnn.txtBtnFooter]}>
								Login to Server "{Model.NameIp()}"
							</Text>
						</TouchableOpacity>
					}
				/>
			</Container>
		);
	}
}