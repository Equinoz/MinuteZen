// Vue affichant le détail d'une séance donnée

import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert } from "react-native";
import { connect } from "react-redux";
import CustomButton from "./Components/CustomButton";
import { displayDuration } from "./Components/displayDuration";
import AddButton from "./Components/AddButton";

class SessionDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  // Affiche un message de confirmation avant la supression
  _delete_session({ id, name }) {
    Alert.alert(
      "Suppression de " + name,
      "Etes-vous sûr de vouloir supprimer cette séance ?",
      [
        {text: "Oui", onPress: () => {
          const action = { type: "DELETE", value: id };
          this.props.dispatch(action);
          this.props.navigation.goBack();
        }},
        {text: "Annuler", style: "cancel"},
      ],
      { cancelable: false }
    );
  }

  // Valide les modifications pour la séance sélectionnée
  _valid_updating = () => {
    const action = (this.props.updatingSession.id == undefined) ? { type: "ADD" } : { type: "VALID_UPDATING" };
    this.props.dispatch(action);
    this.props.navigation.navigate("Sessions");
  }

  // Sélectionne la période à modifier
  _set_period(index) {
    const action = { type: "SELECT_PERIOD", value: index }
    this.props.dispatch(action);
    this.props.navigation.navigate("SetPeriod");
  }

  // Ajoute une période de méditation précédée d'une période de transition
  _add_period = () => {
    const periods = [...this.props.updatingSession.periods,
      {type: "interval", duration: 300},
      {type: "sit", duration: 900, start: 1, end: 1},
    ];
    const action = { type: "UPDATE", value: { ...this.props.updatingSession, periods }};
    this.props.dispatch(action);
  }

  render() {
    return(
      <View style={ styles.container }>
        <TouchableOpacity onPress={ () => this.props.navigation.navigate("SetSessionName") }>
          <Text style={ styles.label }>Modifications: { this.props.updatingSession.name }</Text>
        </TouchableOpacity>
        <FlatList
          style={ styles.list_periods }
          data={ this.props.updatingSession.periods }
          keyExtractor={ item => this.props.updatingSession.periods.indexOf(item).toString() }
          renderItem={ ({item}) => 
            <TouchableOpacity style={ styles.period }
              onLongPress={ () => this._set_period(this.props.updatingSession.periods.indexOf(item)) }>
              <Text style={ styles.text_period }>
                Type: { item.type == "sit" && "assise" }
                { item.type == "stand" && "marchée" }
                { item.type == "interval" && "transition" }{"\n"}
                Durée: { displayDuration(item.duration, true) }</Text>
              { item.type != "interval" && <Text style={ styles.text_period }>
                Début: { (item.start == 1) ? "1 coup" : "3 coups" } de cloche{"\n"}
                Fin: { (item.end == 1) ? "1 coup" : "3 coups" } de cloche</Text> }
            </TouchableOpacity>
          }
        />
        <AddButton text="Ajouter une période" callback={ this._add_period }/>
        <CustomButton style={ styles.delete_button } title="Supprimer la séance"
          callback={ () => this._delete_session(this.props.updatingSession) } />
        <CustomButton title="Valider" callback={ this._valid_updating } />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#61867e",
    alignItems: "center"
  },
  label: {
    fontSize: 22,
    color: "#0e211f"
  },
  list_periods: {
    flexGrow: 0,
    marginTop: 20
  },
  period: {
    backgroundColor: "#f7f6ea",
    width: 230,
    margin: 10,
    padding: 5,
    borderColor: "#344642",
    borderWidth: 1,
    borderRadius: 5
  },
  text_period: {
    fontSize: 18
  },
  delete_button: {
    backgroundColor: "#c92836",
    height: 45,
    width: 260,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 23,
    elevation: 3
  }
});

const mapStateToProps = state => {
  return { updatingSession: state.sessionsReducer.updatingSession };
};

export default connect(mapStateToProps)(SessionDetails);