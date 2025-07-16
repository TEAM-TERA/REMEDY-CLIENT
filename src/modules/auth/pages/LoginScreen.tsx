import React, { useContext, useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { styles } from "../styles/LoginScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { AuthContext } from "../auth-context";
import { useLogin } from "../hooks/useLogin";

function LoginScreen() {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState(null);
  const loginMutation = useLogin();

  const handleLogin = () => {
    setError(null);
    loginMutation.mutate(
        { email, password },
        {
            onSuccess : async (accssToken) => {
                await login(accssToken);
            },
            onError : (err : any) => {
                setError(err.response?.data?.message || err.message);
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