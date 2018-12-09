import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Line extends Component {

    static defaultProps = {
        type: "solid"
    }
    render() {
        const { type } = this.props

        return (
            <div style={{ height: 1, borderBottom: "1px " + type + " #e9e9e9", width: "100%", margin: "20px 0px" }}>

            </div>
        );
    }
}

export default Line;