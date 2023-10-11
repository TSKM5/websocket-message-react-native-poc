import { View, Text, StyleSheet } from "react-native";

export function MessageRow(props:{ text:string, incoming:Boolean }) {
    const {text, incoming} = props;
   return (
     <View style={incoming ? messageRowStyles.incomingRow : messageRowStyles.outgoingRow}>
       <Text style={incoming ? messageRowStyles.incomingText : messageRowStyles.outgoingText}>{text}</Text>
     </View>
   );
 }
 
const messageRowStyles = StyleSheet.create({
     incomingRow: {
         flexDirection: 'row',
         backgroundColor: 'black',
         borderRadius: 10,
         padding: 10,
         marginBottom: 10,
         left: 10,
         alignSelf: 'flex-start',
       },
       incomingText: {
         flexWrap: 'wrap',
         color:'white',
         maxWidth: 250,
       },
       outgoingRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        right: 10,
        alignSelf: 'flex-end',
      },
       outgoingText: {
        flexWrap: 'wrap',
        color:'black',
        maxWidth: 250,
       }
 });