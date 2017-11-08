import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Provider } from 'mobx-react/native';
import noteStore from './stores/noteStore';
import MasterDetail from './components/MasterDetail';

/**
 * docutizr Application Component - this component renders the rest of the
 * application for us.
 *
 * @export
 * @class App
 * @extends {React.Component<undefined, undefined>}
 */
export default class App extends React.Component<undefined, undefined> {
  /**
   * Lifecycle method that renders the component - required
   *
   * @returns {React.Element} the React Element
   * @memberof App
   */
  render() {
    return (
      <Provider noteStore={noteStore}>
        <MasterDetail/>
      </Provider>
    );
  }
}