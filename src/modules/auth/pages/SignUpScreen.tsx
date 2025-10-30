import React, { useState } from "react";
import { Text, View, SafeAreaView, Alert } from "react-native";
import { styles } from "../styles/SignUpScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import HeaderNav from "../components/HeaderNav/HeaderNav";
import { useAuthNavigation } from "../../../hooks/navigation/useAuthNavigation";
import { signUpApi } from "../api/authApi";

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleGenderSelect = (gender: "male" | "female") => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호를 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
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
    } catch (error) {
      Alert.alert("오류", "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav title="회원가입" />
      <View style={styles.formContainer}>
        <Input
          placeholder="이름"
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
          error={errors.name}
        />
        
        <Input
          placeholder="이메일"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          error={errors.email}
        />
        
        <Input
          placeholder="비밀번호"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry
          error={errors.password}
        />
        
        <Input
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          secureTextEntry
          error={errors.confirmPassword}
        />
        
        <Input
          placeholder="생년월일"
          value={formData.birthDate}
          onChangeText={(value) => handleInputChange("birthDate", value)}
          error={errors.birthDate}
        />

        <View style={styles.genderContainer}>
          <Text style={[styles.genderLabel, TYPOGRAPHY.BODY_1]}>성별</Text>
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
          title="회원가입"
          onPress={handleSignUp}
          disabled={isLoading}
          style={[styles.signUpButton, TYPOGRAPHY.BUTTON_TEXT]}
        />
      </View>
    </SafeAreaView>
  );
}

export default SignUpScreen;
