// Texte clignotant

import React from "react";
import { StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";

class BlinkingText extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showText: true };
  }

  componentDidMount() {
    this.blinking = setInterval(() => {
      this.setState(previousState => {
        return { showText: !previousState.showText };
      });
    }, 700);
  }

  componentWillUnmount() {
    clearInterval(this.blinking);
  }

  render() {
    const display = this.state.showText ? this.props.text : ' ';
    return(
      <Text style={ styles.text }>{ display }</Text>
    )
  }
};

const styles= StyleSheet.create({
  text: {
    fontSize: 55,
    color: "#0e211f"
  }
});

BlinkingText.propTypes = {
  text: PropTypes.string.isRequired
};

export default BlinkingText;