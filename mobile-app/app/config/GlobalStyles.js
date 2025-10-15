import {Platform} from 'react-native';
import colors from './colors';

export default {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colors,
  text: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
  },
  inputContainer: {
    backgroundColor: colors.lighterGray,
    borderRadius: 25,
    flexDirection: 'row',
    padding: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  formScreen: {
    padding: 10,
  },
  circledProfilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  titleFontSize: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 6,
  },
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,

    elevation: 3,
  },
  cardBorder: {
    borderColor: colors.LightGray,
    borderWidth: 1,
    borderRadius: 10,
  },
  listContentContainerStyle: {
    paddingTop: 20,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginHorizontal: 5,
  },
  longCard: {
    margin: 5,
  },
  fontWeightMedium: {
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : 'System',
    fontWeight: '500',
  },
  listItemTitle: {
    fontSize: 15,
    marginBottom: 3,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  listItemSubTitle: {fontSize: 10, color: colors.dimGray},
  listItemStyle: {
    marginBottom: 13,
    marginHorizontal: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tip: {
    height: 3,
    width: 40,
    borderRadius: 25,
    backgroundColor: colors.LightGray,
    alignSelf: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
  },
  formField: {
    width: '90%',
    marginBottom: 5,
  },
  registrationFormTopPadding: {
    marginTop: 50,
  },
};
