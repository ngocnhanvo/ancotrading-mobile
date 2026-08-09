import React, { Component } from 'react'
import Pagination from '../react-native-basic-pagination';
import { Dimensions } from 'react-native';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;
export default class PaginationSPD extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dtsl: props.dtsl,
            height: 0,
            pageNum: props.pageNum ? props.pageNum : 20,
            pageSep: props.pageSep ? props.pageSep : 1,
            onPageChange: props.onPageChange,
            props: {...props.props}
        }
    }
    render() {
        let this_sav = this;
        let dtsl = this_sav.state.dtsl;
		let totalPages = Math.ceil(dtsl / this_sav.state.pageNum);
        return(
            <Pagination
                onLayout={(event) => {
                    this_sav.state.height = event.nativeEvent.layout.height + 30;
                }}
                containerStyle={{ display: totalPages > 1 ? '' : 'none'}}
                totalItems={dtsl}
                pagesToDisplay={deviceWidth > 700 ? 8 : deviceWidth > 500 ? 6 : 3}
                pageSize={this_sav.state.pageNum}
                currentPage={this_sav.state.pageSep}
                showLastPagesButtons={false}
                activeBtnStyle={{backgroundColor: '#FFF'}}
                activeTextStyle={{color: '#000'}}
                onPageChange={(page)=> {
                    if(page > 0 & page != this_sav.state.pageSep) {
                        this_sav.state.pageSep = page;
                        this_sav.state.onPageChange(page, this_sav.state.pageNum);
                        //this_sav.searchP(this_sav.state.pageSep, this_sav.state.pageNum);
                    }
                }}
            />
        )
    }
}