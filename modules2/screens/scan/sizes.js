import React, {
	PureComponent
} from 'react';
import { FlatList, StyleSheet } from 'react-native';
const numColumns = 1;
import SizesDetail from './sizesDetail';
import { Model } from '../../Model';
const sortJsonArray = (jsonArray) => {
	return jsonArray.sort((a, b) => {
	  const charA = a.itemNo && a.itemNo.length >= 10 ? a.itemNo[9] : '';
	  const charB = b.itemNo && b.itemNo.length >= 10 ? b.itemNo[9] : '';
	  const order = ['S', '0', 'B', 'L', 'X'];
  
	  const indexA = order.indexOf(charA); // Tìm vị trí của kí tự thứ 9 của a trong mảng order
	  const indexB = order.indexOf(charB); // Tìm vị trí của kí tự thứ 9 của b trong mảng order
  
	  if (indexA !== -1 && indexB !== -1) {
		// Cả hai kí tự đều nằm trong mảng order ('S' hoặc '0')
		return indexA - indexB; // Sắp xếp theo thứ tự trong mảng order ('S' trước '0')
	  } else if (indexA !== -1) {
		// Chỉ kí tự của a nằm trong mảng order, a được ưu tiên lên trước
		return -1;
	  } else if (indexB !== -1) {
		// Chỉ kí tự của b nằm trong mảng order, b được ưu tiên lên trước
		return 1;
	  } else {
		// Cả hai kí tự đều không nằm trong mảng order, giữ nguyên thứ tự tương đối (hoặc có thể sắp xếp theo cách khác nếu cần)
		return 0;
	  }
	});
};
const renderItem = (item, itemNo, this_sav) => {
	if(!Model.scanSizeDetail)
		Model.scanSizeDetail = [];
	return (
		<SizesDetail 
			ref={ref => Model.scanSizeDetail[item.itemNo] = ref}
			item={item}
			itemNo={itemNo}
		/>
	)
};
export default class Sizes extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			itemNo: props.itemNo,
			sizes: props.sizes,
			type: props.type,
		};
	}
	render() {
		let this_sav = this;
		let itemNo = this_sav.state.itemNo;
		let datas = this_sav.state.sizes;
		datas = sortJsonArray(datas);
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
    paddingLeft: 20,
  }
});