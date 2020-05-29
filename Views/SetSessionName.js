// Vue permettant de modifier le nom de la séance

import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { connect } from "react-redux";
import CustomButton from "./Components/CustomButton";

class SetSessionName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Fonction fléchée pour binder
  _update_session_name = () => {
    if (this.state.name) {
      // Si la séance existe déjà on récupère ses périodes, sinon on en crée une nouvelle
      const periods = (this.props.updatingSession.name) ?
        [...this.props.updatingSession.periods] :
        [{ type: "sit", duration: 900, start: 1, end: 1 }];

      // On met à jour la séance avec son nouveau nom
      const session = { ...this.props.updatingSession, name: this.state.name, periods: periods };
      const action = { type: "UPDATE", value: session };
      this.props.dispatch(action);
      this.props.navigation.navigate("SessionDetails");
    }
    else {
      // Si le champ est vide, retour à la vue précédente selon que la séance existe déjà ou pas
      if (this.props.updatingSession.name)
        this.props.navigation.navigate("SessionDetails");
      else
        this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.label }>
          { (this.props.updatingSession.name == undefined) ? "Indiquez le nom de la séance" : "Modifiez le nom de la séance" }
        </Text>
        <TextInput style={ styles.input } onChangeText={ text => this.setState({ name: text }) }
          defaultValue={ this.props.updatingSession.name } placeholder="10 lettres max" maxLength={10} />
        <CustomButton title="Valider" callback={ this._update_session_name } />
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
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18
  },
  input: {
    backgroundColor: "#f7f6ea",
    height: 45,
    width: 220,
    marginBottom: 15,
    textAlign: "center",
    borderRadius: 12,
    fontSize: 20
  }
});

const mapStateToProps = state => {
  return { updatingSession: state.sessionsReducer.updatingSession };
};

export default connect(mapStateToProps)(SetSessionName);