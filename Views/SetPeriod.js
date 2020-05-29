// Vue permettant de créer/modifier les caractéristiques d'une période

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import TimePicker from "./Components/TimePicker";
import Radio from "./Components/Radio";
import CustomButton from "./Components/CustomButton";

class SetPeriod extends React.Component {
  constructor(props) {
    super(props);
    const period = this.props.updatingSession.periods[this.props.periodToUpdate];
    this.periods = [];

    // Selon le type de période on converti les valeurs de la période en valeurs binaires, gérables par le component Radio
    this.state = (period.type != "interval") ?
      {
        type: (period.type == "sit") ? 0 : 1,
        duration: period.duration,
        start: (period.start == 1) ? 0 : 1,
        end: (period.end == 1) ? 0 : 1
      } :
      {
        type: period.type,
        duration: period.duration
      };
  }

  // Envoie les validations au reducer
  _update_session() {
    const action = { type: "UPDATE", value: {...this.props.updatingSession, periods: this.periods }};
    this.props.dispatch(action);
  }

  // Fonction fléchée pour binder
  // Valide les modifications apportées à l'objet this.props.updatingSession
  _valid_period = () => {
    if (this.state.duration != 0) {
      // On reconverti les valeurs binaires du component Radio en objet exploitable si besoin
      const newPeriod = (this.state.type != "interval") ?
        {
          type: (this.state.type) ? "stand" : "sit",
          duration: this.state.duration,
          start: (this.state.start) ? 3 : 1,
          end: (this.state.end) ? 3 : 1
        } :
        this.state;

      this.periods = this.props.updatingSession.periods;
      this.periods.splice(this.props.periodToUpdate, 1, newPeriod);

      this._update_session();
    }

    this.props.navigation.goBack();
  }

  // Fonction fléchée pour binder
  // Supprime la période sélectionnée, ainsi qu'une période de transition adjacente
  _delete_period = () => {
    if (this.props.periodToUpdate == 0)
      this.periods = this.props.updatingSession.periods.slice(2);
    else {
      this.periods = this.props.updatingSession.periods;
      this.periods.splice(this.props.periodToUpdate - 1, 2);
    }

    this._update_session();
    this.props.navigation.goBack();
  }

  render() {
    return(
      <View style={ styles.container }>
        <Text style={ styles.title }>Séance: { this.props.updatingSession.name }</Text>
        <View style={ styles.form }>
          <Text style={ styles.label }>Durée de la période:</Text>
          <TimePicker duration={ this.state.duration } callback={ duration => this.setState({ duration: duration }) } />
          { (this.state.type == "interval") ?
            (<Text style={ styles.label }>Période de transition</Text>) : 
            (<View>
              <Text style={ styles.label }>Type de méditation:</Text>
              <Radio value={ this.state.type } style={ style.radio }
                callback={ value => this.setState({ type: value }) }
                radioProps={[ { label: "Assise", value: 0 }, { label: "Marchée", value: 1 } ]} />
              <Text style={ styles.label }>Coups de cloches au début:</Text>
              <Radio value={ this.state.start } style={ style.radio }
                callback={ value => this.setState({ start: value }) }
                radioProps={[ { label: "Un", value: 0 }, { label: "Trois", value: 1 } ]} />
              <Text style={ styles.label }>Coups de cloches à la fin:</Text>
              <Radio value={ this.state.end } style={ style.radio }
                callback={ value => this.setState({ end: value }) }
                radioProps={[ { label: "Un", value: 0 }, { label: "Trois", value: 1 } ]} />
            </View>)
          }
        </View>
        { this.state.type != "interval" && this.props.updatingSession.periods.length > 1 && 
          <CustomButton style={ styles.delete_button }title="Supprimer la période" callback={ this._delete_period } /> }
        <View style={ styles.buttons } >
          <CustomButton title="Retour" callback={ () => this.props.navigation.goBack() } />
          <CustomButton title="Valider" callback={ this._valid_period } />
        </View>
      </View>
    )
  }
};

const style = {
  radio: {
    formHorizontal: true,
    buttonColor: "#215771",
    buttonSize: 10,
    buttonOuterSize: 18,
    labelStyle: {fontSize: 18, color: "#0e211f"}
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#61867e",
    alignItems: "center"
  },
  title: {
    marginTop: 10,
    fontSize: 25,
    color: "#0e211f"
  },
  form: {
    backgroundColor: "#f7f6ea",
    width: 260,
    marginTop: 15,
    padding: 7,
    borderRadius: 5
  },
  label: {
    margin: 5,
    fontSize: 18,
    color: "#0e211f"
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
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 280
  }
});

const mapStateToProps = state => {
  return {
    updatingSession: state.sessionsReducer.updatingSession,
    periodToUpdate: state.sessionsReducer.periodToUpdate
  }
};

export default connect(mapStateToProps)(SetPeriod);