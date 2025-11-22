import React, { useState } from "react";
import { View, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from "../styles/SignUpScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { useAuthNavigation } from "../../../hooks/navigation/useAuthNavigation";
import { signUpApi } from "../api/authApi";
import UserSvg from "../../../components/icon/icons/UserSvg";

function SignUpScreen() {
  const navigation = useAuthNavigation();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "male" as "male" | "female"
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 실시간 유효성 검사
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return "이름을 입력해주세요";
        if (value.trim().length < 2) return "이름은 2자 이상이어야 합니다";
        return "";
        
      case 'email':
        if (!value.trim()) return "이메일을 입력해주세요";
        if (!/\S+@\S+\.\S+/.test(value)) return "올바른 이메일 형식이 아닙니다 (예: user@example.com)";
        return "";
        
      case 'password':
        if (!value) return "비밀번호를 입력해주세요";
        if (value.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다";
        if (value.length > 20) return "비밀번호는 최대 20자까지 입력 가능합니다";
        return "";
        
      case 'confirmPassword':
        if (!value) return "비밀번호를 한 번 더 입력해주세요";
        if (value !== formData.password) return "비밀번호가 일치하지 않습니다";
        return "";
        
      case 'birthDate':
        if (!value) return "생년월일을 입력해주세요";
        if (value.replace(/\D/g, "").length < 8) return "생년월일 8자리를 모두 입력해주세요 (예: 19900101)";
        if (!isValidBirthDate(value)) return "올바른 날짜를 입력해주세요 (예: 1990-01-01)";
        return "";
        
      default:
        return "";
    }
  };

  const normalizeBirthDateInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  };

  const isValidBirthDate = (yyyyMmDd: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return false;
    const [yStr, mStr, dStr] = yyyyMmDd.split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
    );
  };

  const handleInputChange = (field: string, value: string) => {
    let finalValue = value;
    
    if (field === "birthDate") {
      const formatted = normalizeBirthDateInput(value);
      finalValue = formatted;
      setFormData(prev => ({ ...prev, birthDate: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // 터치된 필드 표시
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
    
    // 실시간 유효성 검사 (터치된 필드만)
    if (touched[field] || finalValue) {
      const error = validateField(field, finalValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    
    // password 변경 시 confirmPassword 재검증
    if (field === "password" && formData.confirmPassword) {
      const error = validateField("confirmPassword", formData.confirmPassword)
      setErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  };

  const handleGenderSelect = (gender: "male" | "female") => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleFocus = (_field: string) => {
    // 포커스 시 필요한 로직이 있다면 여기에 추가
  };

  const handleBlur = (field: string) => {
    // blur 시 해당 필드를 touched로 표시
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 모든 필드 검증
    Object.keys(formData).forEach((field) => {
      if (field !== 'gender') {
        const value = formData[field as keyof typeof formData];
        const error = validateField(field, String(value));
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    
    // 모든 필드를 터치됨으로 표시
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      Alert.alert(
        "입력 확인",
        "모든 정보를 올바르게 입력해주세요.",
        [{ text: "확인" }]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        username: formData.name.trim(),
        password: formData.password,
        email: formData.email.trim(),
        birthDate: formData.birthDate.trim(),
        gender: formData.gender === "male",
      };
      await signUpApi(payload);
      
      Alert.alert(
        "회원가입 완료",
        "회원가입이 완료되었습니다.",
        [
          {
            text: "확인",
            onPress: () => navigation.navigate("Login")
          }
        ]
      );
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message;
      
      let userFriendlyMessage = "회원가입에 실패했습니다.";
      
      if (typeof serverMessage === "string") {
        if (serverMessage.includes("email")) {
          userFriendlyMessage = "이미 사용 중인 이메일입니다.";
        } else if (serverMessage.includes("username")) {
          userFriendlyMessage = "이미 사용 중인 이름입니다.";
        } else {
          userFriendlyMessage = serverMessage;
        }
      }
      
      Alert.alert(
        "회원가입 실패",
        userFriendlyMessage + "\n다시 시도해주세요.",
        [{ text: "확인" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav title="회원가입" variant="withIcon" centerIcon={<UserSvg />} />
      <View style={styles.innerContainer}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.formContainer}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
            extraHeight={100}
            showsVerticalScrollIndicator={false}
          >
            <Input
              placeholder="이름"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              error={touched.name ? errors.name : undefined}
              helperText={!errors.name && !formData.name ? "2자 이상의 이름을 입력해주세요" : undefined}
            />
          
            <Input
              placeholder="이메일"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              keyboardType="email-address"
              error={touched.email ? errors.email : undefined}
              helperText={!errors.email && !formData.email ? "로그인에 사용할 이메일을 입력해주세요" : undefined}
            />
          
            <Input
              placeholder="비밀번호"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              secureTextEntry
              error={touched.password ? errors.password : undefined}
              helperText={!errors.password && !formData.password ? "8~20자로 입력해주세요" : undefined}
            />
          
            <Input
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              secureTextEntry
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
              helperText={!errors.confirmPassword && !formData.confirmPassword ? "비밀번호를 한 번 더 입력해주세요" : undefined}
            />
          
            <Input
              placeholder="생년월일 (YYYY-MM-DD)"
              value={formData.birthDate}
              onChangeText={(value) => handleInputChange("birthDate", value)}
              onFocus={() => handleFocus("birthDate")}
              onBlur={() => handleBlur("birthDate")}
              keyboardType="numeric"
              error={touched.birthDate ? errors.birthDate : undefined}
              helperText={!errors.birthDate && !formData.birthDate ? "예: 1990-01-01" : undefined}
            />

            <View style={styles.genderContainer}>
            <View style={styles.genderButtons}>
              <Button
                title="남성"
                onPress={() => handleGenderSelect("male")}
                style={[
                  styles.genderButton,
                  TYPOGRAPHY.BUTTON_TEXT,
                  formData.gender === "male" ? styles.genderButtonActive : styles.genderButtonInactive
                ]}
                textStyle={formData.gender === "male" ? styles.genderButtonTextActive : styles.genderButtonTextInactive}
              />
              <Button
                title="여성"
                onPress={() => handleGenderSelect("female")}
                style={[
                  styles.genderButton,
                  TYPOGRAPHY.BUTTON_TEXT,
                  formData.gender === "female" ? styles.genderButtonActive : styles.genderButtonInactive
                ]}
                textStyle={formData.gender === "female" ? styles.genderButtonTextActive : styles.genderButtonTextInactive}
              />
            </View>
          </View>

          <Button
            title={isLoading ? "가입 중..." : "회원가입"}
            onPress={handleSignUp}
            disabled={isLoading}
            style={[
              styles.signUpButton, 
              TYPOGRAPHY.BUTTON_TEXT,
            ]}
          />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

export default SignUpScreen;
