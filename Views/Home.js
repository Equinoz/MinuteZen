// Vue "Home"

import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Vibration } from "react-native";
import { connect } from "react-redux";
import KeepAwake from "react-native-keep-awake";
import { displayDuration } from "./Components/displayDuration";
import SystemSetting from "react-native-system-setting";
import BlinkingText from "./Components/BlinkingText";

const Sound = require("react-native-sound");
let bell;

const type = Object.freeze({
  sit: "Assise",
  stand: "Marche",
  interval: "Transition"
});

const mode = Object.freeze({
  STOP: "stop",
  RUN: "run",
  BREAK: "break"
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.countDown;
    this.period = 0;
    this.state = {
      duration: 0,
      mode: mode.STOP,
			blinking: false,
      disableAirplaneButton: false
    };
  }

  // Joue un son de cloche ou vibre selon l'option choisie
  _ring_bell(knocks) {
    if (this.props.option != "vibration") {
			if (knocks == 1)
				bell = new Sound("one_bell.mp3", Sound.MAIN_BUNDLE, error => {
					if (!error)
						bell.play();
				});
			else
				bell = new Sound("three_bells.mp3", Sound.MAIN_BUNDLE, error => {
					if (!error)
						bell.play();
				});
    }
    if (this.props.option != "sound") {
      if (knocks == 1)
        Vibration.vibrate(700);
      else
        Vibration.vibrate([300, 600, 2200, 600, 2100, 600]);
    }
  }

  // Lance/relance le compte à rebours
  _run_countDown() {
    this.countDown = setInterval(() => {
      // Fin de la période en cours
      if (this.state.duration == 0) {
        // Si ce n'est pas une période de transition on joue un son de cloche à la fin de la période
        if (this.props.currentSession.periods[this.period].type != "interval")
          this._ring_bell(this.props.currentSession.periods[this.period].end);

        // Mise à jour de la durée
        if (this.props.currentSession.periods.length > this.period + 1) {
          this.period++;
          // Si la période qui démarre n'est pas une période de transiton on joue un son de cloche
          if (this.props.currentSession.periods[this.period].type != "interval")
            this._ring_bell(this.props.currentSession.periods[this.period].start);
          this.setState({ duration: this.props.currentSession.periods[this.period].duration });
        }

        // Fin de la séance
        else
          this._stop_session();
      }
      // Décompte du temps
      else
        this.setState({ duration: this.state.duration - 1 });
    }, 1000);
  }

  // Démarre une séance de zéro
  _start_session() {
		KeepAwake.activate();
    // Son de cloche en début de séance
    this._ring_bell(this.props.currentSession.periods[0].start);
    this.period = 0;
    clearInterval(this.countDown);
    this.setState({
      duration: this.props.currentSession.periods[0].duration,
      mode: mode.RUN
    });
    this._run_countDown();
  }

  // Mets la séance en cours en pause
  _break_session() {
    clearInterval(this.countDown);
    this.setState({ mode: mode.BREAK });
  }

  // Reprends la séance en cours
  _resume_session() {
    this._run_countDown();
    this.setState({ mode: mode.RUN });
  }

  // Stoppe la séance en cours
  _stop_session() {
		KeepAwake.deactivate();
    clearInterval(this.countDown);
    this.setState({ mode: mode.STOP });

    // Si le mode avion est activé et qu'il faut proposer de le désactiver, affiche le bouton correspondant
    SystemSetting.isAirplaneEnabled()
      .then(enable => {
        if (enable && this.props.must_disable_airplane) {
          this.props.dispatch({ type: "SWITCH", value: false});
          this.setState({ disableAirplaneButton: true });
        }
    });
  }

  // Désactive le bouton mode avion et propose de désactiver le mode avion
  _disable_airplane_mode() {
    this.setState({ disableAirplaneButton: false });
    SystemSetting.switchAirplane(() => {});
  }

  render() {
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.image }
          source={ require("../Pictures/bell.png") }
        />
        {(this.props.currentSession.name) && <Text style={ styles.title }>{ this.props.currentSession.name }</Text>}
        {(this.props.currentSession.periods) && (this.state.mode == mode.STOP) &&
          <Text style={ styles.countdown }>{ displayDuration(this.props.currentSession.periods[0].duration) }</Text>}
        {(this.state.mode == mode.RUN) && <Text style={ styles.countdown }>{ displayDuration(this.state.duration) }</Text>}
        {(this.state.mode == mode.BREAK) && <BlinkingText text={ displayDuration(this.state.duration) } />}
        {(this.state.mode != mode.STOP) && <Text style={ styles.period }>{ type[this.props.currentSession.periods[this.period].type] }</Text>}
        <View style={ styles.buttons }>
          {(this.state.disableAirplaneButton) &&
            <TouchableOpacity style={ [styles.button, styles.disableAirplaneButton] } onPress={ () => this._disable_airplane_mode() }>
              <Text style={ styles.text_button }>Désactiver le mode avion</Text>
            </TouchableOpacity>
          }
          {(this.props.currentSession.periods) && (this.state.mode == mode.STOP) &&
            <TouchableOpacity style={ styles.button } onPress={ () => this._start_session() }>
              <Text style={ styles.text_button }>Démarrer</Text>
            </TouchableOpacity>
          }
          {(this.state.mode == mode.STOP) &&
            <TouchableOpacity style={ styles.button } onPress={ () => this.props.navigation.navigate("Sessions") }>
              <Text style={ styles.text_button }>Choisir une séance</Text>
            </TouchableOpacity>
          }
          {(this.state.mode == mode.RUN) &&
            <TouchableOpacity style={ styles.button } onPress={ () => this._break_session() }>
              <Text style={ styles.text_button }>Pause</Text>
            </TouchableOpacity>
          }
          {(this.state.mode == mode.BREAK) &&
            <TouchableOpacity style={ styles.button } onPress={ () => this._resume_session() }>
              <Text style={ styles.text_button }>Reprendre</Text>
            </TouchableOpacity>
          }
          {(this.state.mode != mode.STOP) &&
            <TouchableOpacity style={ styles.button } onPress={ () => this._stop_session() }>
              <Text style={ styles.text_button }>Réinitialiser</Text>
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity style={ styles.settings } onPress={ () => this.props.navigation.navigate("Settings") }>
          <Image
            style={ styles.image_settings }
            source={ require("../Pictures/settings.png") }
          />
        </TouchableOpacity>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#61867e",
    justifyContent: "space-around",
    alignItems: "center"
  },
  image: {
    height: 150,
    width: 150,
    marginTop: 10,
    borderRadius: 75
  },
  title: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#305e54",
    fontSize: 30,
    color: "#0e211f"
  },
  countdown: {
    fontSize: 55,
    color: "#0e211f"
  },
  period: {
    fontSize: 30,
    color: "#0e211f"
  },
  buttons: {
    alignItems: "center"
  },
  button: {
    backgroundColor: "#215771",
    height: 60,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 30,
    elevation: 3
  },
  disableAirplaneButton: {
    backgroundColor: "#05828f",
    height: 45,
    width: 240,
  },
  text_button: {
    fontSize: 19,
    color: "#0e211f"
  },
  settings: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 10
  },
  image_settings: {
    height: 50,
    width: 50
  }
});

const mapStateToProps = state => {
  return {
    currentSession: state.sessionsReducer.currentSession,
    option: state.settingsReducer.option,
    must_disable_airplane: state.settingsReducer.must_disable_airplane
  }
};

export default connect(mapStateToProps)(Home);
