import React, { Component } from 'react'
import {
	View,
	Dimensions
} from 'react-native';
import { Button } from '../../tools/react-native-elements';
import { FooterNTBVNN } from "../../tools/native-base-vnn";
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class FooterSPD extends Component {
	constructor(props) {
        super(props)
        this.state = {
			props: {...props.props}
        }
        this.ref = null
    }
	render() {
		let this_sav =this;
		return(
			<FooterNTBVNN
				onLayout={(event) => {
					this_sav.state.height = event.nativeEvent.layout.height;
				}}
				childs={
					<View style={{alignItems: 'center'}}>
						<Button 
							onPress={() => {
								this_sav.state.props.navigation.navigate("Scan", {data:''});
							}}
							backgroundColor='none'
							fontWeight='bold'
							icon={{name: 'settings-overscan', buttonStyle:{fontSize:18, fontWeight: 'bold'}}}
							title='SCAN NOW' 
						/>
					</View>
				}
			/>
		)
    }
}