import React, {
	Component
} from 'react'
import {
	View, Dimensions, Text
} from 'react-native'
const { width, height } = Dimensions.get("window");
export default class FooterNTBVNN extends Component {
	constructor(props) {
		super(props);
        this.state = {
            display: 'block'
        }
    }
    render(){
        return (
            <View
            style={{
                backgroundColor:'#88bb64', 
                width: '100%', 
                height: 50, 
                position: 'absolute', 
                bottom: 0,
                display: this.state.display
            }}
            {...this.props}>
                {this.props.childs}
            </View>
        )
    }	
}