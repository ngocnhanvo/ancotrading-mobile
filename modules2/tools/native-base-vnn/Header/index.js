import React, {
	Component
} from 'react'
import {
	View, Dimensions, Text
} from 'react-native'
import DoubleClick from 'react-native-double-click';
import { Model } from "../../../Model";
const { width, height } = Dimensions.get("window");
export default class HeaderNTBVNN extends Component {
	constructor(props) {
		super(props);
    }
    render() {
        return (
            <View
                style={{
                    backgroundColor: '#88bb64',
                    zIndex: 9999,
                    height: 50
                }}
                {...this.props}
            >
                <View style={[{flexDirection: 'row', backgroundColor:'#2c467238'}]}>
                    <View style={{
                        textAlign: "center", 
                        alignItems: "center", 
                        alignSelf: "center", 
                        justifyContent:"center",
                        width: 55,
                        padding: 8,
                        color: '#FFF'
                    }}>
                        {this.props.btnLeft}
                    </View>
                    <View style={{  
                        textAlign: "center", 
                        alignItems: "center", 
                        alignSelf: "center", 
                        justifyContent:"center",
                        width: width - 110, 
                    }}>
                        <DoubleClick onClick={() => { Model.objectM.drawer.toggle() }}>
                            <Text 
                                style={{fontSize:16, color: '#FFF'}}
                            >
                                {this.props.txtMiddle}
                            </Text>
						</DoubleClick>
                    </View>
                    <View 
                        style={{ 
                            textAlign: "center", 
                            alignItems: "center", 
                            alignSelf: "center", 
                            justifyContent:"center",
                            width: 55,
                            padding: 8,
                            color: '#FFF'
                        }}>
                        {this.props.btnRight}
                    </View>
                </View>
            </View>
        )
    }	
}