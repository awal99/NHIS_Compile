import React, {useState} from 'react';
import {StyleSheet, TextInput, ScrollView,Picker,Button,PermissionsAndroid, TouchableOpacity,View,Text} from 'react-native';
import DatePicker from 'react-native-datepicker';
import XLSX from 'xlsx';

var RNFS = require('react-native-fs');

const Form = (props) => {
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [uname, setUname] = useState('');
  const [dob, setDob] = useState('2020-01-15');
  const [sex, setSex] = useState('Male');
  const [contact, setContact] = useState('');
  const [community, setCommunity] = useState('Kukuo');
  const [nhis, setNhis] = useState('');
  const [address, setAddress] = useState('');

  const [error,setError] = useState(false);
  const [saved,setSaved] = useState(null);

  const [data,setData] = useState([]);

  const [count,setCount] =useState(0)

  /****************************
   * method to read file data
   */
  React.useEffect(()=>{
    RNFS.readFile(RNFS.DocumentDirectoryPath +'/nhis.txt','utf8')
        .then(res=>{
            let datajson = JSON.parse(res);
            setCount(datajson.length)
            setData(datajson);
            console.log(res);
        }).catch(err=>{
            console.log(err.message)
        })
  },[])

  /*****************************
   * method to request permission for storage
   */

  const requestCameraPermission = async (callBack) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Compile Require Access to Storage",
          message:"Compile need access to external storage to save excel file",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        callBack()
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  /******************
   * method to export data to excel and download
   */

  const exportData=()=>{
    if(count < 1){
        alert("You cannot export an empty record");
        //return
    }else{
        var ws = XLSX.utils.json_to_sheet(data);

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb,ws,"NHIS LIST");
      
        const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
        console.log(RNFS.ExternalStorageDirectoryPath);
        var file = RNFS.ExternalStorageDirectoryPath + '/nhis_list.xlsx';

        //lets request permission and save data
        requestCameraPermission(function(){
            RNFS.writeFile(file, wbout, 'ascii').then((r)=>{
                alert("Export Completed")
            }).catch((e)=>{
                alert(e.message)
            });
        })
        
    }

  }

  /***********************
   * method to clear all records
   */
  const clearAll=()=>{
    var path = RNFS.DocumentDirectoryPath + '/nhis.txt';
 
    return RNFS.unlink(path)
      .then(() => {
        alert("Records Clared successfully");
        setData([]);
        setCount(0);
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
          alert(err.message);
        console.log(err.message);
      });
  }

  /********************
   * method to save current info to file
   */
  const writeToFile=()=>{
      setError(false);
      setSaved(true);
     
      //lets check for empty field
      if(uname == ""|| uname == null){
          alert("You didnt enter card holder's name");
          setError(true)
          return 
      }
     if(dob == ""|| dob==null){
         alert("You didnt enter Date of Birth");
         setError(true)
         return
     }
     if(nhis==""|| nhis==null){
         alert("You didnt enter NHIS number");
         setError(true)
         return
     }

        if(error == false){
            // now everything is setAddress, lets write to file and count
            var path =RNFS.DocumentDirectoryPath +'/nhis.txt';

            let tempdata = {
                date:date,
                name:uname,
                dob:dob,
                sex:sex,
                contact:contact,
                community:community,
                nhis:nhis,
                address:address
            }
            data.push(tempdata);

            // if(count==0){
            //     setData([]);
            // }
           // let tempdata = [{"1":"2"},{"2":"3"}];
            tempdata = JSON.stringify(data);
            console.log(tempdata);
 
            // write the file
            RNFS.writeFile(path, tempdata, 'utf8')
              .then((success) => {
                alert("Saved successfully");
                setCount(count+1);
                setSaved(false)
              })
              .catch((err) => {
                console.log(err.message);
              });
        }
  }


  return (
    <>
    <View style={{backgroundColor:"#73C2FB", marginBottom:20,paddingHorizontal:10, marginHorizontal:20, paddingTop:20, height:50,elevation:7,justifyContent:"space-between",flexDirection:'row'}}>
        {/* left item is the count of records stored */}
            <Text>{count} Cards Recorded</Text>
        {/* right item would be a button to export to excel */}
            <TouchableOpacity onPress={()=>{exportData()}}>
               <Text style={{color:"green",fontWeight:"bold"}}>Export Data</Text>
            </TouchableOpacity>
    </View>


    <ScrollView contentContainerStyle={styles.container}>

     <Text>Current Date</Text>
      <TextInput
        value={date}
        style={styles.input}
        // onChangeText={text => onChangeText(text)}
        editable={false}
      />
<Text>Full Name</Text>
      <TextInput
        value={uname}
        style={styles.input}
        onChangeText={(text) => setUname(text)}
      />
<Text>Date of Birth</Text>
      <DatePicker
        style={{width: 200}}
        date={dob}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="1920-05-01"
        maxDate="2020-04-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
        }}
        onDateChange={(date) => {
          setDob(date);
        }}
      />
<Text>Phone Number</Text>
      <TextInput
        value={contact}
        style={styles.input}
        maxLength={10}
        onChangeText={(text) => setContact(text)}
        keyboardType="phone-pad"
      />
<Text>Community</Text>
      <TextInput
        value={community}
        style={styles.input}
        onChangeText={(text) => setCommunity(text)}
        editable={false}
      />
<Text>NHIS No.</Text>
      <TextInput
        value={nhis}
        style={styles.input}
        onChangeText={(text) => setNhis(text)}
        keyboardType="number-pad"
      />
<Text>House Address</Text>
      <TextInput
        value={address}
        style={styles.input}
        onChangeText={(text) => setAddress(text)}
      />
<Text>Gender</Text>
      <Picker
        selectedValue={sex}
        style={{height: 50, width: 150}}
        onValueChange={(itemValue, itemIndex) => setSex(itemValue)}>
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

        <Button title="Save and Continue" onPress={()=>{writeToFile()}} disabled={saved}></Button>
        <Text>{""}</Text>
        <Button title="Clear All Records" color="red" onPress={()=>{clearAll()}}></Button>
    </ScrollView>
    </>
  );
};

export default Form;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  container:{
    justifyContent:"space-evenly",
    paddingHorizontal:20,
    paddingBottom:100
  }
});
