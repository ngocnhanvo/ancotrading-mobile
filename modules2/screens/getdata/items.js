import React, { Component } from 'react'
import {
	View,
	Text,
	Dimensions
} from 'react-native'
import styles from './styles.js';

let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class Items extends Component {
	constructor(props) {
        super(props)
        this.state = {
            rowData: {...props.rowData},
			index: props.index,
			pageSep: props.pageSep,
			pageNum: props.pageNum,
        };
		this.state.totalSeconds = this.state.rowData.totalSeconds;
        this.ref = null;
    }
	changeSecondsToMinuteAndHour = (totalSeconds) => {
		let seconds = Math.floor(totalSeconds % 60);
		let minutes = Math.floor((totalSeconds / 60) % 60);
		let hours = Math.floor(totalSeconds / (60 * 60));
	  
		let result = "";
	  
		if (hours > 0) {
			hours = hours < 10 ? `0${hours}` : hours;
		  	result += hours + " hour ";
		}
	  
		if (minutes > 0) {
			minutes = minutes < 10 ? `0${minutes}` : minutes;
		  	result += minutes + " minute ";
		}
	  
		seconds = seconds < 10 ? `0${seconds}` : seconds;
		result += seconds.toString().padStart(2, "0") + " second";
	  
		return result;
	}
	render() {
		let this_sav = this;
		let rowData = this_sav.state.rowData;
		let index = this_sav.state.index + 1 + (this_sav.state.pageSep - 1) * this_sav.state.pageNum;
		let time = this_sav.changeSecondsToMinuteAndHour(rowData.totalSeconds);

		if(rowData.delete)
			return null;
		else {
			let colorSt = {...styles.detail_row};
			colorSt.textAlign = 'right';
			if(rowData.slSP < rowData.tongSLSP)
				colorSt.color = 'red';
			return (
				<View style={{
					borderBottomWidth: 0.7
					, borderBottomColor: '#CCC'
					, backgroundColor: '#FFF'
				}}>
					<View style={{ paddingVertical: 10 }}>
						<View style={{ flexDirection: 'row', height: 55 }}>
							<View style={{ flex: 0.5, marginLeft: 10 }}>
								<Text style={styles.detail_row}>Date: {rowData.dateStr}</Text>
								<Text style={styles.detail_row}>Retrieval times: {rowData.slGet}</Text>
							</View>
							<View style={{ flex: 0.5, marginRight: 10 }}>
								<Text style={[styles.detail_row, {textAlign: 'right'}]}>Customers: {rowData.slKH}/{rowData.slKH}</Text>
								<Text style={[colorSt]}>Products: {rowData.slSP}/{rowData.tongSLSP}</Text>
							</View>
						</View>
						<View style={{ flex: 1, marginLeft: 10 }}>
							<Text style={[styles.detail_row]}>Total wait time: {time}</Text>
						</View>
					</View>
				</View>
			)
		}
    }
}