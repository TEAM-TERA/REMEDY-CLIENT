import { TYPOGRAPHY } from "../../../../constants/typography";
import { styles } from "../../styles/Running/RunningStats"
import { Text } from "react-native";

interface TimeComponentProps {
  timeComponent: string;
}

function TimeComponent({ timeComponent }: TimeComponentProps) {
    return (
        <Text style={[
            parseInt(timeComponent) > 0 ? styles.statText : styles.statTextGray, 
            TYPOGRAPHY.BODY_1
        ]}>
            {timeComponent}
        </Text>
    )
}

export default TimeComponent;