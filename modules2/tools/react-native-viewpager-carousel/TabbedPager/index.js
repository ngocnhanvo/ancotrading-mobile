import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { Model } from '../../../Model';
import ViewPager from '../ViewPager'
import ViewPagerTabs from '../ViewPagerTabs'
const VIEWPORT_WIDTH = Dimensions.get('window').width

class TabbedPager extends PureComponent {

  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.object
    ),
    dev: PropTypes.bool,
    lazyrender: PropTypes.bool,
    renderAsCarousel: PropTypes.bool,
    experimentalMirroring: PropTypes.bool,
    fullScreen: PropTypes.bool,
    contentContainerStyle: PropTypes.any,
    forceRerenderOnPageChange: PropTypes.bool,
    initialPage: PropTypes.object,
    lazyrenderThreshold: PropTypes.number,
    tabContainerPosition: PropTypes.string,
    scrollTabsEnabled: PropTypes.bool,
    staticTabWidth: PropTypes.number,
    showTabIndicator: PropTypes.bool,
    tabIndicatorColor: PropTypes.string,
    tabIndicatorHeight: PropTypes.number,
    tabsVisible: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    firePageChangeIfPassedScreenCenter: PropTypes.bool,

    DividerComponent: PropTypes.any,
    renderTab: PropTypes.func.isRequired,
    onPageChange: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    dev: false,
    lazyrender: false,
    renderAsCarousel: true,
    experimentalMirroring: false,
    fullScreen: true,
    initialPage: {},
    lazyrenderThreshold: 1,
    tabContainerPosition: 'top',
    scrollTabsEnabled: false,
    staticTabWidth: VIEWPORT_WIDTH / 5,
    showTabIndicator: true,
    tabIndicatorColor: 'transparent',
    tabIndicatorHeight: 2,
    tabsVisible: true,
    scrollEnabled: true,
    firePageChangeIfPassedScreenCenter: false,

    onPageChange: () => {},
    forceRerenderOnPageChange: false,
  }

  static TABCONTAINER_POSITION = {
    TOP: 'top',
    BOTTOM: 'bottom',
  }

  constructor(props) {
    super(props)

    this.data = this.props.data || []

    this.tabThresholdPages =
      this.props.renderAsCarousel &&
      this.data.length > 1
        ? Math.ceil((VIEWPORT_WIDTH / this.props.staticTabWidth) / 2) + 1
        : 0

    this.contentThresholdPages =
      this.props.renderAsCarousel &&
      this.data.length > 1
        ? 1
        : 0

    this.pageCount = this.props.data.length

    this.summedTabsWidthOverflow = (this.pageCount + this.tabThresholdPages) * this.props.staticTabWidth
      > VIEWPORT_WIDTH
  
	this.scrollpages = false;
	this.scrolltabs = false;
  }
	componentDidMount() {
		setTimeout(()=> { 
			this.scrollToPage(this.props.defaultScroll, false);
		},0);
	}
  scrollToPage = (pageNumber, animated = true) => {
    if (this.contentPager)
      this.contentPager.scrollToPage(pageNumber, animated);
  }

  scrollToIndex = pageIndex => {
    if (this.contentPager) {
      var sro = pageIndex - this.tabThresholdPages + this.contentThresholdPages;
	  if(sro > this.pageCount + 1) {
		sro = sro - this.pageCount;
	  }
	  else if(sro < 0) {
		sro = this.pageCount + sro;
	  }
	  this.contentPager.scrollToIndex(sro);
	}
  }

  _onPageChange = pageNumber => {
    this.props.onPageChange(pageNumber)
    if (this.props.forceRerenderOnPageChange === true)
      this.forceUpdate()
  }

  _onScroll = (dx) => {
    if (this.tabbar && this.summedTabsWidthOverflow) {
		this.tabbar.scroll(dx);
	}
  }
  
  _onScrollPage = (dx) => {
    /*if (this.contentPager) {
		if(this.scrollpages != true) {
			this.scrolltabs = true;
			//this.contentPager.scroll(dx);
		}
		else {
			this.scrollpages = false;
		}
	}*/
  }


  _renderTabsContainer = (position) => {
    return position === this.props.tabContainerPosition && this.props.tabsVisible
      ? (
		<View  style={{position: 'absolute', marginTop: 146, zIndex: 9999, width: null}}>
			<Image source={Model.backGround} style={{position: 'absolute', width: VIEWPORT_WIDTH, opacity:0.82, height: 48, flex: 1}} resizeMode="stretch" />
			
			<View style={{flex:1}}>
				{this.props.showTabIndicator && (
					<Image source={Model.logoHeaderDetail} style={[styles.tabIndicator,{position: 'absolute', width: 66, height: 66, marginTop: -10 }]} resizeMode="stretch" />
				  )}
				  <ViewPagerTabs
					ref={tabbar => {
					  this.tabbar = tabbar
					}}
					log={false}
					dev={false}
					renderAsCarousel={this.props.renderAsCarousel && this.props.data.length > 1}
					data={this.props.data}
					onScroll={this._onScrollPage}
					renderPage={this._renderTab}
					pageWidth={this.props.staticTabWidth}
					pagingEnabled={false}
					onShouldSwitchToPage={this.scrollToPage}
					scrollEnabled={this.props.scrollTabsEnabled}
					thresholdPages={this.tabThresholdPages}
					defaultScroll={this.props.defaultScroll}
					experimentalMirroring={false}
					
				  />
			</View>
		</View>
      )
      : null
  }

  _renderDividerComponent = (position) => {
    return position === this.props.tabContainerPosition && this.props.tabsVisible
      ? this.props.DividerComponent
      : null
  }

  _renderTab = ({data, _pageIndex, _pageNumber}) => {
    return this.props.tabsVisible
      ? this.props.renderTab({data, _pageIndex, _pageNumber})
      : null
  }

  render() {
    return (
      <View style={this.props.fullScreen ? styles.fullScreen : null}>
        {this._renderTabsContainer(TabbedPager.TABCONTAINER_POSITION.TOP)}
        {this._renderDividerComponent(TabbedPager.TABCONTAINER_POSITION.TOP)}
        <ViewPager
          ref={contentPager => {
            this.contentPager = contentPager
          }}
          renderAsCarousel={this.props.renderAsCarousel && this.props.data.length > 1}
          data={this.props.data}
          onPageChange={this._onPageChange}
          onScroll={this._onScroll}
		  ActiveSpiner={this.props.ActiveSpiner}
        />
        {this._renderDividerComponent(TabbedPager.TABCONTAINER_POSITION.BOTTOM)}
        {this._renderTabsContainer(TabbedPager.TABCONTAINER_POSITION.BOTTOM)}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  tabIndicator: {
    alignSelf: 'center',
  },
})

export default TabbedPager