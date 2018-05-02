import { StyleSheet } from 'react-native';
import { theme } from "../../index"
const { padding, color, fontSize, fontFamily, windowWidth, normalize } = theme;

const resizeMode = 'contain';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: color.background,
        paddingVertical: 10
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.large
    },
    description: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.regular
    }
});

export default styles;