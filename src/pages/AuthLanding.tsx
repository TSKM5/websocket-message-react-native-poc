import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Toast from 'react-native-toast-message';
import { WebSocketContext } from '../context/WebSocketContext';

const showSuccessToast = () => {
  Toast.show({
    type: 'success',
    text1: 'Connection was established.',
    text2: 'Please wait while being redirected.',
  });
}
const showErrorToast = () => {
  Toast.show({
    type: 'error',
    text1: 'Connection failed.',
    text2: 'Please ensure you have the correct session code.',
  });
}

export default function AuthLanding({navigation}: {navigation: any}) {
  const { ws } = useContext(WebSocketContext); 
  const [value, setValue] = useState('');
  const [result, setResult] = useState<boolean>(); 
  const [load, setLoad] = useState<boolean>(false);
  const isInitialMount = useRef(true);
  const ref = useBlurOnFulfill({value, cellCount: 5});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        setLoad(false);
        if(result){
            showSuccessToast();
            navigation.navigate('ChatScreen', {sessionRef:value})
        } else {
            showErrorToast();
        }
      }
  }, [result])

  useEffect(() => {
    if(value.length === 5){
        setLoad(true);
        if(!ws?.getWsStatus){
            ws?.connect();
        }
        ws?.connectToSession((e:boolean) => setResult(e), value);
    }
  },[value])
  return (
    <View style={styles.container}>
      <Toast/>
      <Text style={styles.displayText}>Enter Session Code Below:</Text>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={5}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      {
       load && ( 
                <View style={styles.loadingWidget}>
                    <ActivityIndicator size="large" />
                </View>
        )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  displayText:{
    marginTop: 140,
    color: '#fff',
    fontSize: 20,
  },
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#fff',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#8f8e8d',
    borderBottomWidth: 2,
  },
  loadingWidget: {
    marginTop:100,
  }
});
