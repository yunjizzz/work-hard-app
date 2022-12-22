import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform} from 'react-native';
import { theme } from './colors';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@toDos'

export default function App() {
  const [working, setWorking] = useState(true);
  const [text,setText] = useState("");
  const [toDos, setTodos] = useState({});
  useEffect(()=> {
    loadToDos();
  },[]);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if(s){
      setTodos(JSON.parse(s));
    }
  }
  const addTodo = async() => {
    if(text === ""){
      return;
    }
    //save todo
    //onst newTodos = Object.assign({},toDos, {[Date.now()]: {text, work:working}});
    const newTodos = {...toDos,[Date.now()]: {text, working:working}};
    
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText('');
  }
  const deleteTodo = async(key) => {
    if(Platform.OS === "web"){
       const ok = confirm('삭제 하시겠습니까?');
       if(ok){
          const newTodos = {...toDos}
          delete newTodos[key];
          setTodos(newTodos);
          saveTodos(newTodos);
       }
    }else{
      Alert.alert(
        "Delete To Do", "Are you sure?",
        [
          {text:"i'm sure", onPress:() => {
          const newTodos = {...toDos}
          delete newTodos[key];
          setTodos(newTodos);
          saveTodos(newTodos);
        }},
          {text:"cancel"},
        ])
    }
  }
 
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText,color: working? "white": theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText,color: !working? "white": theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          value={text}
          placeholder={working? "Add a To do": "Where do you want to go?"}
          style={styles.input}/>
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) => (
         toDos[key].working === working ? 
         <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={()=> deleteTodo(key)}>
              <Feather name="trash-2" size={18} color="white" />
            </TouchableOpacity>
          </View> : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:'row',
    marginTop: 100,
  },
  btnText:{
    fontSize:44,
    fontWeight: "600",
  },
  input:{
    backgroundColor: "white",
    paddingVertical:15,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 30,
    fontSize: 18,
  },
  toDo:{
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText:{
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  }
});
