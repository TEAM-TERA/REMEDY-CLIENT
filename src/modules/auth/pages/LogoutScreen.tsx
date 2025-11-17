import React, { useContext, useState } from "react";
import { Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/LogoutScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Button from "../../../components/button/Button";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { AuthContext } from "../auth-context";
import { useAppNavigation } from "../../../hooks/navigation/useAppNavigation";

function LogoutScreen() {
  const { logout, user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useAppNavigation();

  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "정말로 로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav title="로그아웃" />
      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <Text style={[styles.userName, TYPOGRAPHY.HEADLINE_3]}>
            {user?.name || "사용자"}
          </Text>
          <Text style={[styles.userEmail, TYPOGRAPHY.BODY_1]}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={[styles.message, TYPOGRAPHY.BODY_1]}>
            로그아웃하시면 앱의 모든 기능을
          </Text>
          <Text style={[styles.message, TYPOGRAPHY.BODY_1]}>
            사용하실 수 없습니다.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="로그아웃" 
            onPress={handleLogout} 
            disabled={isLoading}
            style={styles.logoutButton}
          />
          <Button 
            title="취소" 
            onPress={handleCancel}
            disabled={isLoading}
            style={styles.cancelButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default LogoutScreen;
