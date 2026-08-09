import React, { PureComponent } from "react";
import { View, ImageBackground, TouchableOpacity, BackHandler } from "react-native";

import { Container, Text } from "../../tools/native-base";
import stylevnn from '../../styles/public.js';
import styles from "./styles";
const launchscreenBg = require("../../images/launchscreen-bg.jpg");
import { Model } from "../../Model/index.js";
import HeaderSPD from "./header.js";
import FooterSPD from "./footer.js";

const MergeCode = (this_sav, compare) => {
	compare = compare ? Model.this_sav != this_sav : true;
	if(compare) {
		Model.loadScreenAfterKill((rs)=>{
			if(rs.screen)
			{
				this_sav.props.navigation.navigate(rs.screen, rs.state);
			}
			else {
				Model.activeSplashScreen();
			}
		});
		Model.this_sav = this_sav;
		Model.navigatePublic = this_sav.props;
		Model.mainScreen = Model.navigatePublic.navigation.state.routeName;

		if(Model.objectM.drawer)
			Model.objectM.drawer.updateDisabled(false);
		if(Model.objectM.spinnerMain)
			Model.objectM.spinnerMain.close();
		Model.objectM.sidebar.getDateCollectData((date) => {
			this_sav.setState({date: date});
		});
		Model.objectM.sidebar.updateCount((count_cart)=> {
			count_cart = Model.objectM.countCart(count_cart);
			if(Model.headerHome)
				Model.headerHome.setState({count_cart});
		});
	}
};

class Home extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			count_cart: null,
			username: Model.UserName,
			date: 'Loading...'
		};
	}
	render() {
		let this_sav = this;
		return (
			<Container ref="myRef" style={stylevnn.container}>
				<ImageBackground source={launchscreenBg} style={styles.imageContainer}>
					<HeaderSPD 
						ref={ref => Model.headerHome = ref} 
						props={this_sav.props}
					/>

					<View style={{flexDirection: 'column'}}>
						<Text style={{color: '#FFF', paddingTop:10, textAlign: 'center'}}>Date of most recent data collection</Text>
						<TouchableOpacity
							onPress={()=>{
								this_sav.props.navigation.navigate('GetData');
							}}
						>
							<Text style={[stylevnn.underLine, {color: '#FFF', paddingTop:10, textAlign: 'center'}]}>
								{this_sav.state.date}
							</Text>
						</TouchableOpacity>
					</View>
					
					<FooterSPD 
						ref={ref => Model.footerHome = ref} 
						props={this_sav.props}
					/>
				</ImageBackground>
			</Container>
		);
	}
	componentDidMount() {
		let this_sav = this;
		MergeCode(this_sav);
		this_sav.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			return true;
		});
	}
	componentWillUnmount() {
		this.backHandler.remove();
		this.willFocusSubscription.remove();
	}
	UNSAFE_componentWillMount() {
		let this_sav = this;
		this_sav.willFocusSubscription = this_sav.props.navigation.addListener(
			'willFocus', () => {
				MergeCode(this_sav, true);
			}
		);
	}
}

export default Home;