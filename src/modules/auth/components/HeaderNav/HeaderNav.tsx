import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../../../constants/typography";
import  {TEXT_COLORS} from "../../../../constants/colors";
import Blank from "../Blank/Blank";
import Icon from "../../../../components/icon/Icon";

type HeaderNavProps = {
    title: string;
    variant?: 'default' | 'withIcon';
    centerIcon?: ReactNode;
    rightComponent?: ReactNode;
};

function HeaderNav({title, variant = 'default', centerIcon, rightComponent}: HeaderNavProps){
    if (variant === 'withIcon') {
        return(
            <View style = {styles.container}>
                <Icon name="left" color={TEXT_COLORS.CAPTION_1} />
                <View style={styles.centerContent}>
                    {centerIcon}
                    <Text style = {[TYPOGRAPHY.SUBTITLE, styles.text]}>{title}</Text>
                </View>
                {rightComponent || <Blank />}
            </View>
        )
    }

    return(
        <View style = {styles.container}>
            <Icon name="left" color={TEXT_COLORS.CAPTION_1} />
            <Text style = {[TYPOGRAPHY.SUBTITLE, styles.text]}>{title}</Text>
            {rightComponent || <Blank />}
        </View>
    )
}

export default HeaderNav;