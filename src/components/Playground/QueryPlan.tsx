import * as React from 'react'
import { connect } from 'react-redux'
import { styled } from '../../styled'
import { getQueryPlan } from '../../state/sessions/selectors'

export interface Props {
  value: string
}

export class QueryPlanViewer extends React.Component<Props, {}> {
  private node: any
  private viewer: any

  componentDidMount() {
    const CodeMirror = require('codemirror')
    require('codemirror/addon/fold/foldgutter')
    require('codemirror/addon/fold/brace-fold')
    require('codemirror/addon/dialog/dialog')
    require('codemirror/addon/search/search')
    require('codemirror/addon/search/searchcursor')
    require('codemirror/addon/search/jump-to-line')
    require('codemirror/keymap/sublime')
    require('codemirror-graphql/mode')

    this.viewer = CodeMirror(this.node, {
      lineWrapping: true,
      value: this.props.value || '',
      readOnly: true,
      theme: 'graphiql',
      mode: 'graphql',
      keyMap: 'sublime',
      foldGutter: {
        minFoldSize: 4,
      },
      gutters: ['CodeMirror-foldgutter'],
      extraKeys: {
        // Persistent search box in Query Editor
        'Cmd-F': 'findPersistent',
        'Ctrl-F': 'findPersistent',

        // Editor improvements
        'Ctrl-Left': 'goSubwordLeft',
        'Ctrl-Right': 'goSubwordRight',
        'Alt-Left': 'goGroupLeft',
        'Alt-Right': 'goGroupRight',
      },
    })
  }

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value
  }

  componentDidUpdate() {
    const value = this.props.value || ''
    this.viewer.setValue(value)
  }

  componentWillUnmount() {
    this.viewer = null
  }

  setRef = ref => {
    this.node = ref
  }

  /**
   * Public API for retrieving the CodeMirror instance from this
   * React component.
   */
  getCodeMirror() {
    return this.viewer
  }

  /**
   * Public API for retrieving the DOM client height for this component.
   */
  getClientHeight() {
    return this.node && this.node.clientHeight
  }

  render() {
    return <QueryPlanCodeMirror ref={this.setRef} />
  }
}

const QueryPlanCodeMirror = styled('div')`
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;

  .CodeMirror {
    height: 100%;
    position: absolute;
    box-sizing: border-box;
    background: none;
    padding-left: 38px;
  }

  .CodeMirror-cursor {
    display: none !important;
  }

  .CodeMirror-scroll {
    overflow: auto !important;
    max-width: 50vw;
    margin-right: 10px;
  }

  .CodeMirror-sizer {
    margin-bottom: 0 !important;
  }

  .CodeMirror-lines {
    margin: 20px 0;
    padding: 0;
  }

  .cm-string {
    color: ${p => p.theme.editorColours.property} !important;
  }

  // This is a hack to cover a couple holes in our "almost-graphql" representation
  // of the Query Plan result
  .cm-invalidchar {
    color: rgba(255, 255, 255, 0.4);
  }
`

export const QueryPlan = connect(state => ({
  queryPlan: getQueryPlan(state),
}))(
  props =>
    props.queryPlan ? <QueryPlanViewer value={props.queryPlan} /> : null,
)
