
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Form from "./src/Form";

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Form/>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
 
});

export default App;
