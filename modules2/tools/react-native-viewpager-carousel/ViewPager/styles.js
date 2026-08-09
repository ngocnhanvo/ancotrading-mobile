

export default {
  btnCenterView: {
	alignItems: 'center',
	textAlign: 'center',
	alignSelf:'center',
	padding: 10
  },
  container: {
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexDirection: 'row',
    /*
     * bug in react-native
     * overflow style has to be set
     * https://github.com/facebook/react-native/issues/12926
     */
    overflow: 'hidden',
  },
  rowContainer: {
    flexGrow: 1,
  },
  mirror: {
    flexGrow: 1,
  }
};
