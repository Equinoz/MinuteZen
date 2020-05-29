// Component permettant de saisir une durée

import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { displayDuration } from "./displayDuration";
 
const TimePicker = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
 
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
 
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
 
  // Modifie la props "duration" du component parent
  const handleConfirm = (date) => {
    hideDatePicker();
    let currentDay = new Date();
    currentDay = new Date(currentDay.toDateString());
    date = date.getTime(); 
    let duration = (date - currentDay) / 1000;
    duration = duration - duration % 60;
    props.callback(duration);
  };

  // Configuration de la props "date"
  const _getDate = () => {
		let date = new Date;
    return new Date(date.toDateString());
  }


  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
      <Text style={ styles.label }>{ displayDuration(props.duration) }</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
				date={_getDate()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center"
  },
  label: {
    backgroundColor: "#fff",
    width: 70,
    textAlign: "center",
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#215771"
  }
});
 
export default TimePicker;
