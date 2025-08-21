import React, { useContext, useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { styles } from "../styles/LoginScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { AuthContext } from "../auth-context";
import { useLogin } from "../hooks/useLogin";
import { useAppNavigation } from "../../../hooks/navigation/useAppNavigation";

function LoginScreen() {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();
  const navigation = useAppNavigation();

  const handleLogin = () => {
    setError(null);
    loginMutation.mutate(
        { email, password },
        {
            onSuccess : async (accssToken) => {
                await login(accssToken);
                console.log("로그인 완료");
                navigation.navigate('Home');
            },
            onError : (err : any) => {
                console.error('Login error:', err);
                if (err.code === 'NETWORK_ERROR') {
                    setError('네트워크 연결을 확인해주세요.');
                } else if (err.response?.status === 401) {
                    setError('이메일 또는 비밀번호가 올바르지 않습니다.');
                } else if (err.response?.status === 403) {
                    setError('접근 권한이 없습니다. 관리자에게 문의하세요.');
                } else {
                    setError(err.response?.data?.message || err.message || '로그인에 실패했습니다.');
                }
            },
        }
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav />
      <View style={styles.inputContainer}>
        <Input
          placeholder="이메일을 입력해주세요"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && (
          <Text style={[styles.errorText, TYPOGRAPHY.CAPTION_1]}>
            {error}
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="로그인" onPress={handleLogin} disabled={isLoading} />
        <View style={styles.textContainer}>
          <Text style={[styles.text, TYPOGRAPHY.CAPTION_1]}>비밀번호 재설정</Text>
          <Text style={[styles.text, TYPOGRAPHY.CAPTION_1]}>회원가입</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;