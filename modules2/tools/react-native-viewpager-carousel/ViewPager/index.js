import React, { Component } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  PanResponder
} from 'react-native'
import PropTypes from 'prop-types'
import Mirror, { scrollviewBootstrap } from 'react-native-mirror'
import { Model } from '../../../Model';
import { Table, TableWrapper, Cell } from 'react-native-table-component';
import renderIf from 'render-if';
import FontAwesome from '../../winta-font-awesome';
import styles from "./styles";
const VIEWPORT_WIDTH = Dimensions.get('window').width
const VIEWPORT_HEIGHT = Dimensions.get('window').height
const element = (data) => (
		<TouchableOpacity onPress={() => { Model.navigatePublic(data.name) }} activeOpacity={.5}>
			{renderIf(data.icon !== '')(
				<View style={styles.btnCenterView}>
					<FontAwesome name={data.icon} style={{ textAlign: 'center', color: Model.IconContent.color, fontSize: Model.IconContent.size, padding: 5 }} />
					<Text style={{textAlign: 'center', color: Model.IconContent.text.color}}>{data.title}</Text>
				</View>
			)}
		</TouchableOpacity>
	);

let intervalID = null;
export default class ViewPager extends Component {

  static defaultProps = {
    dev: false,
    log: false,
    thresholdPages: 1,
    renderAsCarousel: true,
    pageWidth: VIEWPORT_WIDTH,
    pagingEnabled: false,
    containerStyle: {},
    renderPage: () => {},
    onPageChange: () => {},
    onScroll: () => {},
    scrollEnabled: true,
    data: [],
    experimentalMirroring: false,
    showNativeScrollIndicator: false,
    lazyrender: false,
    initialPage: {},
    lazyrenderThreshold: 1,
    firePageChangeIfPassedScreenCenter: false,
  }

  static propTypes = {
    lazyrenderThreshold: PropTypes.number,
    containerStyle: PropTypes.any,
    data: PropTypes.arrayOf(
      PropTypes.object
    ),
    dev: PropTypes.bool,
    log: PropTypes.bool,
    initialPage: PropTypes.object,
    renderAsCarousel: PropTypes.bool,
    thresholdPages: PropTypes.number,
    pageWidth: PropTypes.number,
    scrollEnabled: PropTypes.bool,
    pagingEnabled: PropTypes.bool,
    experimentalMirroring: PropTypes.bool,
    showNativeScrollIndicator: PropTypes.bool,
    lazyrender: PropTypes.bool,
    firePageChangeIfPassedScreenCenter: PropTypes.bool,

    renderPage: PropTypes.func,
    onPageChange: PropTypes.func,
    onScroll: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this._pageWithDelta = (VIEWPORT_WIDTH - this.props.pageWidth) / 2

    this._onMomentumScrollEndTimeout = null

    this.pageReferences = {}
    this.data = this.props.data || []
    this.pageCount = this.data.length
    this.thresholdPages =
      this.props.renderAsCarousel &&
      this.pageCount > 1
        ? this.props.thresholdPages : 0
    this.pageIndex = this.thresholdPages
    this.pageIndexBeforeDrag = this.thresholdPages

    this.dataSource= [...this._prepareData(this.props.data || [])];
	this.countRen = 0;
	

	var arrOffset = {};
	var arrLimit = {};
	var arrJumpLM = {};
	var arrList = {};
	var arrListRoot = {};
	var lengthDTS = this.dataSource.length;
	for(var i=0; i<lengthDTS; i++)
	{
		var item = this.dataSource[i];
		arrOffset[item.index] = 0;
		
		arrLimit[item.name] = 1;
		arrJumpLM[item.name] = 1;
		
		if(item.data.length > 0) {
			var dataTbl = Model.convertTable(item.data, 2);
			arrList[item.name] = dataTbl.slice(0, 1);
			arrListRoot[item.name] = dataTbl;
		}
		else {
			arrList[item.name] = [];
			arrListRoot[item.name] = [];
		}
	}
	
	this.state = {
		offset: arrOffset,
		limit: arrLimit,
		list: arrList,
		listRoot: arrListRoot,
		jumpLM: arrJumpLM,
		scrollEnabled: true,
		visible: false
	};
	this.offsetX = 0;
	this.offsetY = 0;
	this._panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
          // The gesture has started. Show visual feedback so the user knows
          // what is happening!

          // gestureState.d{x,y} will be set to zero now
        },
        onPanResponderMove: (evt, gestureState) => {
          // The most recent move distance is gestureState.move{X,Y}

          // The accumulated gesture distance since becoming responder is
          // gestureState.d{x,y}
			var snapTo = this.offsetX + evt.nativeEvent.pageX;
			
			this.scrollView.scrollTo({x: snapTo, y: 0, animated: false});
        },
        onPanResponderRelease: (evt, gestureState) => {
			
			this.offsetX += evt.nativeEvent.pageX;
		}
    });
  }

  scroll = dx => {
    const realPageWidth = VIEWPORT_WIDTH / this.props.pageWidth / 5
    const realPageWidthTrunc = Math.trunc(realPageWidth)

    const centerPageDelta = realPageWidthTrunc % 2 === 0
      ? -(this.props.pageWidth / 2 + this.props.pageWidth * (realPageWidthTrunc / 2 - 1))
      : -this.props.pageWidth * (Math.floor(realPageWidthTrunc / 2))

    const thresholdOffset = this.props.renderAsCarousel ? (this.props.pageWidth * this.thresholdPages + centerPageDelta) : 0
    let centeredScrollX = dx / (realPageWidth) - this.props.pageWidth + thresholdOffset
    const xBiggerThanZero = centeredScrollX > 0
    const xBiggerThanScrollViewWitdh = (centeredScrollX + VIEWPORT_WIDTH)
      > (this.pageCount + this.thresholdPages) * this.props.pageWidth

    if (!xBiggerThanZero && !this.props.renderAsCarousel)
      centeredScrollX = 0

    if (xBiggerThanScrollViewWitdh && !this.props.renderAsCarousel)
      centeredScrollX = ((this.pageCount + this.thresholdPages) * this.props.pageWidth) - VIEWPORT_WIDTH

    this._scrollTo({
      animated: false,
      x: centeredScrollX,
    })
  }

  scrollToPage = (pageNumber, animated = true) => {
	  
    this._scrollTo({
      animated: animated,
      x: ((pageNumber - 1) + this.thresholdPages) * VIEWPORT_WIDTH,
    })
	//this.updateOffset(pageNumber);
  }

  scrollToPageWithKeyValuePair = keyValuePair => {
    const pageIndex = this._getPageIndexByKeyValuePair(keyValuePair)
    this.scrollToIndex(pageIndex, false)
  }

  scrollToIndex = (pageIndex, animated = true) => {
    let index = pageIndex < 0 ? 0 : pageIndex
    const lastIndex = this.dataSource.length - 1
    index = index > lastIndex ? lastIndex : index
    this._scrollTo({
      animated,
      x: index * VIEWPORT_WIDTH
    })
	//this.updateOffset(index);
  }

  /*
   * private methods
   */
  _setPageNumber = (data) => {
    return data.map((_data, index) => {
      return Object.assign({}, _data, {
        _pageNumber: index + 1,
      })
    })
  }

  _setPageIndex = data => {
    return data.map((_data, index) => {
      return Object.assign({}, _data, {
        _pageIndex: index,
      })
    })
  }

  _addThresholdPages = data => {
    let preparedData = []

    const multiplicator = data.length > 0 ? Math.ceil(this.thresholdPages / data.length) : 0

    let thresholdDataFront = []
    let thresholdDataEnd = []

    for (let i = 0; i < multiplicator; i++) {
      thresholdDataFront = [...thresholdDataFront, ...[...data].reverse()]
      thresholdDataEnd = [...thresholdDataEnd, ...data]
    }

    let thresholdFront = thresholdDataFront.slice(0, this.thresholdPages).reverse()
    let thresholdEnd = thresholdDataEnd.slice(0, this.thresholdPages)

    thresholdFront = thresholdFront.map(thresholdPage => ({
      ...thresholdPage,
      _isThresholdPage: true,
    }))
    thresholdEnd = thresholdEnd.map(thresholdPage => ({
      ...thresholdPage,
      _isThresholdPage: true,
    }))

    preparedData = [...thresholdFront, ...data, ...thresholdEnd]

    return preparedData
  }

  _prepareData = (data) => {
    const initializedData = this._setPageNumber(data)

    let preparedData = [...initializedData]
    if (this.props.renderAsCarousel) {
      preparedData = this._addThresholdPages(initializedData)
    }
    preparedData = this._setPageIndex(preparedData)

    return [...preparedData]
  }

  _scrollTo = (options) => {
    if (this.scrollView) {
      this.scrollView.scrollTo(options)
    }
  }

  _getCurrentScrollIndex = offsetX => {
    return Math.ceil(((offsetX + this._pageWithDelta) / this.props.pageWidth) * 100) / 100
  }

  _onScroll = (event) => {
    //if (this._onMomentumScrollEndTimeout)
    //  clearTimeout(this._onMomentumScrollEndTimeout)

    let offsetX = event.nativeEvent.contentOffset.x;
    this.scrollingRight = (offsetX > this.lastx)
    this.lastx = offsetX
	//this.offsetX = offsetX;
    //this.offsetY = event.nativeEvent.contentOffset.y;
    this.props.onScroll(offsetX)
    const scrollIndex = this._getCurrentScrollIndex(offsetX)
	
	if (this.props.renderAsCarousel && scrollIndex % 1 < 0.03) {
      if (Math.trunc(scrollIndex) === 0) {
        offsetX = VIEWPORT_WIDTH * (this.dataSource.length - 2)
        this._scrollTo({
          animated: false,
          x: offsetX,
        })
        this.props.onScroll(offsetX)

      } else if (Math.trunc(scrollIndex) === this.dataSource.length - 1) {
        offsetX = VIEWPORT_WIDTH
        this._scrollTo({
          animated: false,
          x: offsetX,
        })
        this.props.onScroll(offsetX)
      }
    }

    this.pageIndex = Math.round(scrollIndex)
  }
  
	renderFooter = () => {
		return (
			<View
				style={{
					borderTopWidth: 1,
					borderColor: "#c8e1ff",
					height: 1
				}}
			/>
		)
	}
	
	renderHeader = (data) => {
		return (
			<View>
				<Image
				  source={{uri: Model.linkRoot + data.banner}} style={{width: null, height: 194, backgroundColor:'#FFF'}}
				/>
				<Text style={{textAlign:'center', fontSize: 16, fontWeight: 'bold', padding: 15, backgroundColor:'#FFF'}}>{data.title}</Text>
			</View>
		)
	}
	
	updateOffset = (index) => {		
		if(index <= 0) {
			index = this.pageCount;
		}
		else if(index > this.pageCount) {
			index = 1;
		}
		
		
		if(this.state.offset[index] === 0) {
			var arrOffset = this.state.offset;
			arrOffset[index] = 1;
			if(intervalID != null) {
				clearTimeout(intervalID);
			}
			
			intervalID = setTimeout(() => {
				this.setState({offset: arrOffset},() => {
					
				});	
			},200);			
		}
	}
	
	componentDidUpdate(prevProps, prevState) {
		var this_sav = this;
		var arrOffset = this.state.offset;
		var arrDTS = this.dataSource.filter((item) => { return arrOffset[item.index] == 0 }).slice(0, 5);
		var next= false;
		for(var i in arrDTS)
		{
			var row = arrDTS[i];
			try {
				arrOffset[row.index] = 1;
				next = true;
			}
			catch(r){ }
		}
		
		if(next == true) 
		{
			setTimeout(function()
			{
				this_sav.setState({ offset: arrOffset });
			}, 0);
		}
		else
		{
			this_sav.props.ActiveSpiner(false);
		}
	}
	componentWillMount() {
		this.props.ActiveSpiner(true);
	}
	componentDidMount() {
		this.setState({visible: true});
	}
	
	render() {
		var this_sav = this;
		return (
		  <View
			style={styles.container}
		  >
				<ScrollView
					ref={(scrollView) => {
						this.scrollView = scrollView
					}}
					decelerationRate={0}
					showsHorizontalScrollIndicator={false}
					directionalLockEnabled={true}
					onScrollBeginDrag={() => {
						this.firstx = this.lastx;
						this.pageIndexBeforeDrag = this.pageIndex;
						var d = new Date();
						this.firstSecond = d.getTime();
					}}
					onScrollEndDrag={()=>{ 
						var interval = VIEWPORT_WIDTH;
						var snapTo = (this.scrollingRight)? Math.ceil(this.lastx / interval) : Math.floor(this.lastx / interval);
						var scrollTo = snapTo * interval;
						var distinct = Math.abs(scrollTo - this.lastx);
						
						var d = new Date();
						var lastSecond = d.getTime();
						var distinctSecond = lastSecond - this.firstSecond;

						if(distinctSecond > 100) {
							if(distinct <= VIEWPORT_WIDTH/2) {
								this_sav.scrollView.scrollTo({x:scrollTo, y:0, animated: true});
								const scrollIndex = this._getCurrentScrollIndex(scrollTo);
								//this.updateOffset(scrollIndex);
							}
							else {
								this_sav.scrollView.scrollTo({x:this.firstx, y:0, animated: true});
								const scrollIndex = this._getCurrentScrollIndex(this.firstx);
							}
						}
						else {
							this_sav.scrollView.scrollTo({x:scrollTo, y:0, animated: true});
							const scrollIndex = this._getCurrentScrollIndex(scrollTo);
							//this.updateOffset(scrollIndex);
						}
					}}
				  horizontal={true}
				  scrollEnabled={true}
				  onScroll={this._onScroll}
				  scrollEventThrottle={1}>
				  {
					this.dataSource.map((data, index0) => (			  
						<View
							key={"ViewPage"+index0}
							name={data.name}
							style={{
								width: this.props.pageWidth,
								flex: 1,
								backgroundColor: '#FFF'
							}}
						>	
							{renderIf(this.state.offset[data.index] == 1)(
								<FlatList
									data={this.state.listRoot[data.name]}
									extraData={this.state}
									horizontal={false}
									renderItem={({item, index}) => (
										<TableWrapper key={`warp${index}`} style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
										{
											item.map((cellData, cellIndex) => (
												<Cell key={`cell${cellIndex}`} data={element(cellData)} borderStyle={{borderColor: '#c8e1ff'}} />
											))
										}
										</TableWrapper>
									)}
									keyExtractor={(item, index) => index.toString()}
									ListFooterComponent={this.renderFooter}
									ListHeaderComponent={this.renderHeader(data)}
									stickyHeaderIndices={[0]}
								/>
							)}
						</View>
					))
				  }
				</ScrollView>
		  </View>
		)
	}
}

