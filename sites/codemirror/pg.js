// PG format syntax highlighting mode for CodeMirror 5
// Implemented as Finite State Machine (could be extended to a full parser)
//
// reference: <https://codemirror.net/5/doc/manual.html#modeapi>

const reserved = "\x00-\x20<>\"{}\\^`|"
const unquoteStart = `[^${reserved}:',-]`

// language tokens
const NUMBER = /-?(?:0|[1-9][0-9]*(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/
const BOOLEAN = /true|false/
const COLON = ":"
const COMMA = ","
const EMPTY_LINE = /^[ \t]*(?:#.*)?$/
const TRAILING_SPACE = /[ \t]*(?:#.*)?$/
const UNQUOTED_VALUE = new RegExp(`${unquoteStart}[^${reserved},]*`)
const UNQUOTED_ID = new RegExp(`${unquoteStart}[^${reserved}]*`)
const UNQUOTED_PROPERTY = new RegExp(`${unquoteStart}[^${reserved}:,]*:`)
const SPACES = /[ \t]+/
const DIRECTION = /->|--/
const ESCAPED = /\\(?:["'\/bfnrt]|u[0-9a-fA-f]{4})/

const tag = {
  label: "keyword",
  identifier: "identifier",
  escape: "qualifier",
  target: "identifier",
  property: "attribute",
  boolean: "atom",
  number: "number",
  value: "string",
  comma: "punctuation",
  direction: "tag",
  comment: "comment",
  space: "space",
}

function startState() {
  return {
    current: "Statement",
    next: null,
    quoteChar: null,
    stringType: null,
  }
}

function token(stream, state) {
  const skipState = cur => {
    state.current = cur
    return null
  }
  const afterWhitespace = next => {
    state.current = "Whitespace"
    state.next = next
  }
  const startString = (stringType, next) => {
    state.current = "String"
    state.next = next
    state.quoteChar = stream.next()
    state.stringType = stringType
    return stringType
  }
  const error = () => {
    stream.next()
    return "error"
  }

  const match = token => stream.match(token)
  const atQuotation = () => stream.peek() == "\"" || stream.peek() == "'"

  // console.log(state); console.log(stream.peek())

  switch (state.current) {

    case "Statement":
      state.next = null
      if (match(EMPTY_LINE)) {
        return tag.comment
      } else if (atQuotation()) {
        return startString(tag.identifier,"AfterFirstIdentifier")
      } else if (match(UNQUOTED_ID)) {
        if (stream.current().endsWith(":")) {
          afterWhitespace("Source")
        } else {
          afterWhitespace("AfterNodeOrSource")
        }
        return "identifier"
      }
      stream.eat(/[ \t]+/) // wrong intend 
      return error()

    case "AfterFirstIdentifier":
      if (match(COLON)) {
        state.current = "Source"
        return "identifier"
      } else if (match(SPACES)) {
        state.current = "AfterNodeOrSource"
        return tag.space
      }

    case "AfterNodeOrSource":
      if (stream.sol()) {
        return skipState("Statement")
      } else if (match(TRAILING_SPACE)) {
        afterWhitespace("AfterNodeOrSource")
      } else if (match(DIRECTION)) {
        afterWhitespace("Target")
        return tag.direction
      }
      return skipState("Label")

    case "Source":
      if (match(TRAILING_SPACE)) {
        afterWhitespace("Source")
        return tag.comment
      } else if (match(UNQUOTED_ID)) {
        afterWhitespace("Direction")
        return "identifier"
      } else if (atQuotation()) {
        return startString(tag.identifier,"Direction")
      }
      return error() 

    case "Direction":
      if (match(DIRECTION)) {
        afterWhitespace("Target")
        return tag.direction
      }
      return error() 

    case "Target":
      if (match(UNQUOTED_ID)) {
        afterWhitespace("Label")
        return tag.target
      } else if (atQuotation()) {
        return startString(tag.identifier,"Label")
      }
      return error()
          
    case "Label":
      if (stream.match(/^[ \t]+/)) {
        return tag.space
      } else if (stream.sol()) {          
        return skipState("Statement")
      } else if (match(TRAILING_SPACE)) {
        afterWhitespace("Label")
        return tag.comment
      } else if (stream.match(/:[ \t]*/)) { // label
        if (match(UNQUOTED_ID)) {
          afterWhitespace("Label")
        } else if (atQuotation()) {
          return startString(tag.identifier,"Label")
        } else {
          return error() 
        }
        return tag.label
      } else if (atQuotation()) {
        return startString(tag.property,"Property")
      } else if (match(UNQUOTED_PROPERTY)) {
        if (stream.eol() || stream.match(/[ \t]+/,false)) {
          afterWhitespace("Value")
        } else {
          state.current = "Value"
        }
        return tag.property
      }
      return error()

    case "Property":
      if (match(COLON)) {
        state.current = "Value"
        return tag.property
      } else {
        return error()
      }

    case "AfterValue":
      if (match(TRAILING_SPACE)) {
        afterWhitespace("AfterValue")
        return tag.comment
      } else if (stream.sol()) {
        if (stream.match(/[ \t]+,/)) {
          state.current = "Value"
          return tag.comma
        }
        return skipState("Statement")
      }
      if (match(SPACES)) {
        return tag.space
      } else if (match(COMMA)) {
        state.current = "Value"
        return tag.comma
      } else if (atQuotation()) {
        return startString(tag.property,"Property")
      } else if (match(UNQUOTED_PROPERTY)) {
        if (stream.eol() || stream.match(SPACES,false)) {
          afterWhitespace("Value")
        } else {
          state.current = "Value"
        }
        return tag.property
      }
      return error()

    case "Value":
      if (match(TRAILING_SPACE)) {
        afterWhitespace("Value")
        return tag.comment
      } else if (stream.sol()) {
        return error()
      } else if (match(BOOLEAN)) {
        state.current = "AfterValue"
        return tag.boolean
      } else if (match(NUMBER)) {
        state.current = "AfterValue"
        return tag.number
      } else if (match(UNQUOTED_VALUE)) {
        state.current = "AfterValue"
        return tag.value
      } else if (atQuotation()) {
        return startString(tag.value,"AfterValue")
      }
      return error()

    case "Whitespace":
      if (match(TRAILING_SPACE)) {
        return tag.comment
      } else if (match(SPACES)) {
        // required space or continuation line
        if (state.next) {
          state.current = state.next
          state.next = false
          return tag.space
        } else {
          return error()
        }
      } else if (stream.sol()) {
        return skipState("Statement")
      }
      return error()

    case "String":
      if (match(ESCAPED)) {
        return tag.escape
      } else if (stream.match(/\\.?/)) {
        return "error"
      }
      // TODO: use RegExp instead
      var next
      while ((next = stream.peek()) != null) {
        if (next == "\\") break
        stream.next()
        if (next == state.quoteChar) {
          state.quoteChar = null
          state.current = state.next
          state.next = null
          break
        }
      }
      return state.stringType
   
    default:
      return error()
  }
}

CodeMirror.defineMode("pg", () => {
  return {
    startState,
    lineComment: "#",
    token,
  }
})
