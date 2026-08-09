import React, {
	PureComponent
} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
const { width } = Dimensions.get('window');
const numColumns = width < 600 ? 3 : 4;
import ColorsDetail from './colorsDetail';
import { Model } from '../../Model';
const renderItem = (item, itemNo, this_sav) => {
	if(!Model.scanColorDetail)
		Model.scanColorDetail = [];
	
	return (
		<ColorsDetail 
			ref={ref => Model.scanColorDetail[item.itemNo] = ref}
			item={item}
			itemNo={itemNo}
		/>
	)
};
export default class Colors extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			itemNo: props.itemNo,
			colorData: props.colorData
		};
	}
	render() {
		let this_sav = this;
		let itemNo = this_sav.state.itemNo;
		let datas = this_sav.state.colorData;
		
		let songuyen = Math.ceil(datas.length/numColumns);
		let sodu = songuyen*numColumns - datas.length;
		for(let i=0;i<sodu;i++)
			datas.push({name:'', image: ''});
		return (
			<FlatList
				data={datas}
				style={{maxHeight: songuyen * 160}}
				renderItem={(item)=> {
					return renderItem(item.item, itemNo, this_sav); 
				}}
				keyExtractor={(item, index) => item.itemNo} // hoặc item.name nếu tên màu là duy nhất
				numColumns={numColumns} // Số cột bạn muốn hiển thị, có thể điều chỉnh
				contentContainerStyle={styles.listContentContainer} // Để căn chỉnh nội dung FlatList
			/>
		);
	}
};

const styles = StyleSheet.create({
  listContentContainer: {
    paddingLeft: 0, // Thêm padding xung quanh FlatList nếu cần
  },
  itemContainer: {
    flex: 1, // Chia đều không gian trong hàng
    margin: 10,
    alignItems: 'center', // Căn giữa theo chiều ngang
    // Các style khác cho item container nếu cần
  },
  colorBox: {
    width: 300,
    height: 300,
    borderWidth: 1, // Viền cho hình ảnh màu (tùy chọn)
    borderColor: '#ddd', // Màu viền (tùy chọn)
    marginBottom: 10, // Khoảng cách giữa hình ảnh và tên màu
  },
  colorName: {
    fontSize: 12,
	color: '#000',
    textAlign: 'center',
	padding: 5,
	marginTop: 5,
	borderWidth: 1,
	borderColor: '#ccc'
  },
});