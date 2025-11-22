import React, { useContext, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/LoginScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import { HeaderNav } from "../../../components";
import { AuthContext } from "../auth-context";
import { useLogin } from "../hooks/useLogin";
import { useAuthNavigation } from "../../../hooks/navigation/useAuthNavigation";
import { useAppNavigation } from "../../../hooks/navigation/useAppNavigation";
import UserSvg from "../../../components/icon/icons/UserSvg";
import DangerSvg from "../../../components/icon/icons/DangerSvg";
import RemedyLogoSvg from "../../../assets/images/auth/RemedyLogoSvg";
import GoogleOAuthSvg from "../../../assets/images/auth/GoogleOAuthSvg";
import KakaoOAuthSvg from "../../../assets/images/auth/KakaoOAuthSvg";
import NaverOAuthSvg from "../../../assets/images/auth/NaverOAuthSvg";

function LoginScreen() {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const loginMutation = useLogin();
  const authNavigation = useAuthNavigation();
  const appNavigation = useAppNavigation();

  const validateEmail = (value: string): string => {
    if (!value.trim()) return "이메일을 입력해주세요";
    if (!/\S+@\S+\.\S+/.test(value)) return "올바른 이메일 형식이 아닙니다";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "비밀번호를 입력해주세요";
    if (value.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다";
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleLogin = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setLoginError("");

    if (emailValidation || passwordValidation) {
      return;
    }

    loginMutation.mutate(
        { email, password },
        {
            onSuccess : async (accssToken) => {
                await login(accssToken);
                console.log("로그인 완료");
                appNavigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
            },
            onError : (err : any) => {
                console.error('Login error:', err);
                if (err.code === 'NETWORK_ERROR') {
                    setLoginError('네트워크 연결을 확인해주세요.');
                } else if (err.response?.status === 401) {
                    setLoginError('비밀번호가 일치하지 않습니다.');
                } else if (err.response?.status === 403) {
                    setLoginError('접근 권한이 없습니다. 관리자에게 문의하세요.');
                } else {
                    setLoginError(err.response?.data?.message || err.message || '로그인에 실패했습니다.');
                }
            },
        }
    )
  };

  const handleSignUp = () => {
    authNavigation.navigate('Terms');
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav title="로그인" variant="withIcon" centerIcon={<UserSvg />} />
      <View style={styles.innerContainer}>
        <RemedyLogoSvg style={styles.logo} />
        <View style={styles.inputContainer}>
          <Input
            placeholder="이메일을 입력해주세요"
            value={email}
            onChangeText={handleEmailChange}
            error={emailError}
          />
          <Input
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            error={passwordError}
          />
        </View>
        {loginError && (
          <View style={styles.loginErrorContainer}>
            <DangerSvg />
            <Text style={[styles.loginErrorText, TYPOGRAPHY.CAPTION_1]}>
              {loginError}
            </Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button title="로그인" onPress={handleLogin} disabled={isLoading} />
          <View style={styles.textContainer}>
            <TouchableOpacity>
              <Text style={[styles.text, TYPOGRAPHY.CAPTION_1]}>비밀번호 재설정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={[styles.text, TYPOGRAPHY.CAPTION_1]}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <GoogleOAuthSvg />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <KakaoOAuthSvg />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <NaverOAuthSvg />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;