// Component gérant les boutons radio

import React from "react";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import PropTypes from "prop-types";

class Radio extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <RadioForm formHorizontal={this.props.style.formHorizontal}>
        {
          this.props.radioProps.map((obj, i) => (
            <RadioButton labelHorizontal={true} key={i} >
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={this.props.value === i}
                onPress={(value) => {this.props.callback(value)}}
                borderWidth={1}
                buttonInnerColor={this.props.style.buttonColor}
                buttonOuterColor={this.props.style.buttonColor}
                buttonSize={this.props.style.buttonSize}
                buttonOuterSize={this.props.style.buttonOuterSize}
                buttonWrapStyle={{marginLeft: 8}}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal={true}
                onPress={(value) => {this.props.callback(value)}}
                labelStyle={this.props.style.labelStyle}
                labelWrapStyle={{marginLeft: 8}}
              />
            </RadioButton>
          ))
        }
      </RadioForm>
    )
  }
};

Radio.defaultProps = {
  style: {
    formHorizontal: false,
    buttonColor: "#0e211f",
    buttonSize: 16,
    buttonOuterSize: 24,
    labelStyle: {height: 32, textAlignVertical: "center", fontSize: 24, color: "#0e211f"}
  }
}

Radio.propTypes = {
  value: PropTypes.oneOf([0, 1, 2]).isRequired,
  callback: PropTypes.func.isRequired,
  radioProps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOf([0, 1, 2]).isRequired
    }).isRequired
  ).isRequired,
  style: PropTypes.shape({
    formHorizontal: PropTypes.bool,
    buttonColor: PropTypes.string,
    buttonSize: PropTypes.number,
    buttonOuterSize: PropTypes.number,
    labelStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  })
};

export default Radio;