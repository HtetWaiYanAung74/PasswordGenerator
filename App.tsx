import { Formik } from 'formik';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { number, object } from 'yup';
import colors from './components/themes/colors';

const PasswordSchema = object().shape({
  passwordLength: number()
    .max(16, 'Should be max of | characters')
    .min(4, 'Should be min of 4 characters')
    .required('Length is required')
});

export default function App () {

  const [password, setPassword] = useState('');
  const [isPassGenerated, setPassGenerated] = useState(false);

  // Password Policy
  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);
  
  const generatePasswordString = (passwordLength: number) => {
    let characterList = '';

    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    if (upperCase) {
      characterList += upperCaseChars;
    }
    if (lowerCase) {
      characterList += lowerCaseChars;
    }
    if (numbers) {
      characterList += digitChars;
    }
    if (symbols) {
      characterList += specialChars;
    }

    const passwordResult = createPassword(characterList, passwordLength);

    setPassword(passwordResult);
    setPassGenerated(true);
  }

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  }

  const resetPassword = () => {
    setPassword('');
    setPassGenerated(false);
    setLowerCase(true);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'>
      <SafeAreaView style={styles.container}>
        <View style={styles.formView}>
          <Text style={styles.titleText}>
            Password Generator
          </Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={PasswordSchema}
            onSubmit={values => {
              generatePasswordString(+values.passwordLength);
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset
              /* and other goodies */
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View>
                    <Text>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    value={values.passwordLength}
                    keyboardType='numeric'
                    onChangeText={handleChange('passwordLength')}
                    placeholder='Eg. 8'
                    style={styles.inputStyle}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include Lowercase letters</Text>
                  <BouncyCheckbox
                    isChecked={lowerCase}
                    fillColor={colors.lowerCaseColor}
                    onPress={() => setLowerCase(!lowerCase)}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include Uppercase letters</Text>
                  <BouncyCheckbox
                    isChecked={upperCase}
                    fillColor={colors.upperCaseColor}
                    onPress={() => setUpperCase(!upperCase)}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include Numbers</Text>
                  <BouncyCheckbox
                    isChecked={numbers}
                    fillColor={colors.numberColor}
                    onPress={() => setNumbers(!numbers)}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Include Symbols</Text>
                  <BouncyCheckbox
                    isChecked={symbols}
                    fillColor={colors.symbolColor}
                    onPress={() => setSymbols(!symbols)}
                  />
                </View>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    disabled={!isValid}
                    onPress={handleSubmit}
                    style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnTxt}>
                      Generate Password
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleReset();
                      resetPassword();
                    }}
                    style={styles.secondaryBtn}>
                    <Text>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        { isPassGenerated &&
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.subTitle}>
              Results:
            </Text>
            <Text style={styles.description}>
              Long Press to copy
            </Text>
            <Text
              selectable={true}
              style={styles.generatedPassword}>
              {password}
            </Text>
          </View>
        }
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  formView: {
    margin: 8,
    padding: 8
  },
  titleText: {
    marginBottom: 16,
    fontSize: 32,
    fontWeight: '600'
  },
  inputWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  errorText: {
    color: colors.errorColor,
    fontSize: 12
  },
  inputStyle: {
    width: '30%',
    padding: 8,
    borderColor: colors.borderColor,
    borderRadius: 4,
    borderWidth: 0.5
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  primaryBtn: {
    width: 120,
    backgroundColor: colors.primaryColor,
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 8
  },
  primaryBtnTxt: {
    color: colors.whiteColor,
    textAlign: 'center',
    fontWeight: '700'
  },
  secondaryBtn: {
    width: 120,
    backgroundColor: colors.secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 8
  },
  card: {
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 6
  },
  cardElevated: {
    backgroundColor: colors.whiteColor,
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  generatedPassword: {
    marginBottom: 16,
    color: colors.blackColor,
    fontSize: 22,
    textAlign: 'center'
  },
  subTitle: {
    marginBottom: 2,
    fontSize: 26,
    fontWeight: '600'
  },
  description: {
    color: colors.descColor,
    marginBottom: 8
  }
});