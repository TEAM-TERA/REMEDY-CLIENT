import { Text,View } from "react-native";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { styles } from "../../styles/Running/RunningStats";
import TimeComponent from "./TimeComponent";

interface TimerProps {
    timeComponents: { hours: string; minutes: string; seconds: string };
}

function Timer({ timeComponents }: TimerProps) {
    return (
        <View style={styles.textContainer}>
            <TimeComponent timeComponent={timeComponents.hours} />
            <Text style={[styles.statTextGray, TYPOGRAPHY.BODY_1]}>
              :
            </Text>
            <TimeComponent timeComponent={timeComponents.minutes} />
            <Text style={[styles.statTextGray, TYPOGRAPHY.BODY_1]}>
              :
            </Text>
            <TimeComponent timeComponent={timeComponents.seconds} />
        </View>
    )
}

export default Timer;