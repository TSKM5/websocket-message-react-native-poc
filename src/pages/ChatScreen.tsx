import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Text, SafeAreaView, Pressable } from "react-native";
import { MessageRow } from "../components/MessageUtilities";
import { WebSocketContext } from "../context/WebSocketContext";

type message = {
    text:string, 
    incoming: boolean
}

export default function ChatScreen({route, navigation}: {route:any, navigation: any}){
    const { sessionRef } = route.params ? route.params : undefined;
    const [text, setText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const [incomingValue, setIncomingValue] = useState<string>(); 
    const [messageList, setMessageList] = useState<message[]>([]); 
    const { ws } = useContext(WebSocketContext); 

    function sendMessage() {
        ws?.sendMessage(text);
        setMessageList([...messageList, {text: text, incoming: false}])
        setText('');
    }

    useEffect(() => {
        ws?.setValueCallback(setIncomingValue); 
        if(scrollViewRef.current){
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    }, []);

    useEffect(() => {
        if(incomingValue !== null && incomingValue !== '' && incomingValue !== undefined){
            setMessageList([...messageList, {text: incomingValue!, incoming: true}])
            setIncomingValue('');
        }
    },[incomingValue])
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.keyboardContainer}
            >
                <Text style={styles.title}>{"Connected to: " + sessionRef}</Text>
                <View style={styles.contentWrapper}>
                    <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow: 1}} onContentSizeChange={() => scrollViewRef!.current!.scrollToEnd({ animated: false })}>
                        <View style={styles.messageList}>
                            {
                                messageList.map((e, i) => <MessageRow key={i} incoming={e.incoming} text={e.text} />)
                            }
                        </View>
                    </ScrollView>                  
                    <View style={styles.messageInputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type here"
                            onChangeText={setText}
                            multiline
                            value={text}
                        />
                        <Pressable style={{flexDirection:'row'}} onPress={sendMessage}>
                            <Image 
                                resizeMode='contain' 
                                resizeMethod='auto'
                                source={require('./../../assets/sendIcon.png')} 
                                style={styles.sendImage}
                            />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardContainer: {
        flex: 1,
        paddingBottom: 40, 
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
    },
    messageList: {
        flex: 1,
        width: '100%',
    },
    messageInputWrapper: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        width: '100%',
        marginTop: 10,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 250,
        marginLeft: 15,
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    sendImage:{
        width: 25, 
        height: 25, 
        marginLeft: 10,
        marginRight: 15,
        alignSelf:'flex-end',
        marginBottom:5,
    }, 
    title:{
        textAlign: 'center'
    }
});