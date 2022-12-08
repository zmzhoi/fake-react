"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/libs/convert.ts
function camelCaseToDashCase(camelCase) {
  return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function convertToInlineStyle(style) {
  return Object.entries(style).reduce((acc, [attr, val]) => {
    if (acc !== "") {
      acc += " ";
    }
    acc += `${camelCaseToDashCase(attr)}: ${val};`;
    return acc;
  }, "");
}

// src/fake-react/FakeReact.ts
function renderRoot(dom, root2) {
  if (!root2) {
    throw new Error("Cannot find root element.");
  }
  const realDom = createRealDom(dom);
  root2.appendChild(realDom);
}
function createRealDom(virtualDom) {
  if (virtualDom === null) {
    return null;
  }
  let realDom;
  if (typeof virtualDom === "string") {
    realDom = document.createTextNode(virtualDom);
    return realDom;
  }
  const { type, props } = virtualDom;
  if (type instanceof Function) {
    const instance = new type(props);
    instance.currentVirtualDom = instance.template();
    realDom = createRealDom(instance.currentVirtualDom);
    instance.container = realDom;
  } else {
    realDom = document.createElement(type);
    setProps(realDom, props);
    props.children.forEach((child) => {
      const childRealDom = createRealDom(child);
      realDom.appendChild(childRealDom);
    });
  }
  return realDom;
}
function updateRealDom(parent, nextVirtualDom, currentVirutalDom, index = 0) {
  if (nextVirtualDom && !currentVirutalDom) {
    parent.appendChild(FakeReact.createRealDom(nextVirtualDom));
  } else if (!nextVirtualDom && currentVirutalDom) {
    parent.removeChild(parent.childNodes[index]);
  } else if (isChanged(nextVirtualDom, currentVirutalDom)) {
    parent.replaceChild(FakeReact.createRealDom(nextVirtualDom), parent.childNodes[index]);
  } else if (nextVirtualDom == null ? void 0 : nextVirtualDom.type) {
    const _currentVirutalDom = currentVirutalDom;
    const _nextVirtualDom = nextVirtualDom;
    const maxLen = Math.max(
      _nextVirtualDom.props.children.length,
      _currentVirutalDom.props.children.length
    );
    for (let i = 0; i < maxLen; i++) {
      updateRealDom(
        parent.childNodes[index],
        _nextVirtualDom.props.children[i],
        _currentVirutalDom.props.children[i],
        i
      );
    }
  }
}
var FakeReact = {
  renderRoot,
  createRealDom,
  updateRealDom
};
function isChanged(nextVirtualDom, currentVirutalDom) {
  if (typeof nextVirtualDom === "string" && typeof currentVirutalDom === "string") {
    return nextVirtualDom !== currentVirutalDom;
  }
  if (nextVirtualDom === null && currentVirutalDom !== null) {
    return true;
  }
  if (nextVirtualDom !== null && currentVirutalDom === null) {
    return true;
  }
  if (typeof nextVirtualDom !== typeof currentVirutalDom) {
    return true;
  }
  if ((nextVirtualDom == null ? void 0 : nextVirtualDom.props) && (currentVirutalDom == null ? void 0 : currentVirutalDom.props)) {
    const currentProps = currentVirutalDom.props;
    const nextProps = nextVirtualDom.props;
    const currentPropsLength = Object.keys(currentProps).length;
    const nextPropsLength = Object.keys(nextProps).length;
    if (currentPropsLength !== nextPropsLength) {
      return true;
    } else {
      for (const prop in currentProps) {
        if (prop === "children") {
          continue;
        }
        if (!(prop in nextProps)) {
          return true;
        }
        if (prop === "style") {
          if (convertToInlineStyle(currentProps[prop]) !== convertToInlineStyle(nextProps[prop])) {
            return true;
          }
        } else {
          if (currentProps[prop] !== nextProps[prop]) {
            return true;
          }
        }
      }
    }
  }
  if ((nextVirtualDom == null ? void 0 : nextVirtualDom.type) !== (currentVirutalDom == null ? void 0 : currentVirutalDom.type)) {
    return true;
  }
  return false;
}
function isEventProp(attr) {
  return attr.startsWith("on");
}
function setProps(dom, props) {
  Object.keys(props).forEach((prop) => {
    if (prop === "children") {
      return;
    } else if (isEventProp(prop)) {
      setEventListener(dom, prop, props[prop]);
    } else if (prop === "style") {
      setAttribute(dom, prop, convertToInlineStyle(props[prop]));
    } else {
      setAttribute(dom, prop, props[prop]);
    }
  });
}
function setAttribute(dom, attr, val) {
  if (typeof val === "boolean") {
    if (val === true) {
      dom.setAttribute(attr, "true");
      dom[attr] = true;
    } else {
      dom[attr] = false;
    }
  } else {
    dom.setAttribute(attr, val);
  }
}
function setEventListener(dom, event, handler) {
  const eventName = event.replace("on", "").toLowerCase();
  dom.addEventListener(eventName, handler);
}

// src/fake-react/Component.ts
var Component = class {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.mounted = false;
    this.init();
  }
  init() {
  }
  didMount() {
  }
  didUpdate() {
  }
  template() {
    return "";
  }
  setState(nextState) {
    this.state = nextState;
    this.rerender();
  }
  rerender() {
    var _a;
    const currentVirtualDom = this.currentVirtualDom;
    const nextVirtualDom = this.template();
    const parent = (_a = this.container) == null ? void 0 : _a.parentElement;
    const index = [...parent.childNodes].indexOf(this.container);
    updateRealDom(parent, nextVirtualDom, currentVirtualDom, index);
    this.currentVirtualDom = nextVirtualDom;
  }
};

// src/jsx-runtime/jsx-runtime.ts
function handleChildren(children) {
  if (Array.isArray(children)) {
    return children.map((child) => {
      return typeof child === "number" ? String(child) : child;
    });
  } else if (typeof children === "string" || typeof children === "number") {
    return [typeof children === "number" ? String(children) : children];
  } else {
    return [];
  }
}
function jsx(type, props) {
  return {
    type,
    props: __spreadProps(__spreadValues({}, props), {
      children: handleChildren(props.children)
    })
  };
}
var jsxs = jsx;

// example/components/Header.jsx
var Header = class extends Component {
  template() {
    return /* @__PURE__ */ jsx(
      "h1",
      {
        style: {
          background: "#3f51b5",
          color: "#fffafa",
          padding: "1.5rem",
          fontWeight: "600",
          fontSize: "2rem",
          textAlign: "center",
          boxShadow: "0px 2px 8px 2px rgb(0 0 0 / 20%)"
        },
        children: this.props.children
      }
    );
  }
};

// example/components/Template.jsx
var Template = class extends Component {
  template() {
    return /* @__PURE__ */ jsx("div", { style: { width: "100vw", height: "100vh" }, children: this.props.children });
  }
};

// example/components/Todo.jsx
var Todo = class extends Component {
  template() {
    const { index, name, done, onToggle } = this.props;
    return /* @__PURE__ */ jsxs("li", { style: { marginBottom: "1rem" }, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            textDecoration: done ? "line-through" : "none",
            display: "inline-block",
            marginRight: "1rem"
          },
          children: [
            index + 1,
            ". ",
            name
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          style: {
            color: "white",
            fontSize: "0.9rem",
            background: done ? "#2196f3" : "#3f50b5",
            border: "none",
            borderRadius: "3px",
            padding: "6px 0",
            boxSizing: "border-box",
            width: "85px",
            cursor: "pointer"
          },
          onClick: () => onToggle(index),
          children: done ? "Redo" : "Complete"
        }
      )
    ] });
  }
};

// example/components/Todos.jsx
var Todos = class extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "onToggle", (index) => {
      this.setState(__spreadProps(__spreadValues({}, this.state), {
        todos: this.state.todos.map(
          (todo, i) => i === index ? __spreadProps(__spreadValues({}, todo), { done: !todo.done }) : todo
        )
      }));
    });
    __publicField(this, "onChange", (event) => {
      const nextValue = event.target.value;
      console.log(nextValue);
      this.setState(__spreadProps(__spreadValues({}, this.state), {
        keyword: nextValue
      }));
    });
    __publicField(this, "onKeyDown", (event) => {
      if (event.key === "Enter") {
        if (event.target.value.trim() === "") {
          alert("\uC785\uB825\uAC12\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
          return;
        }
        this.setState({
          keyword: "",
          todos: this.state.todos.concat({ name: this.state.keyword, done: false })
        });
      }
    });
  }
  init() {
    this.state = {
      keyword: "",
      todos: []
    };
  }
  template() {
    const { onChange, onKeyDown, onToggle } = this;
    const { keyword, todos } = this.state;
    const { title } = this.props;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          minWidth: "300px",
          width: "50vw",
          margin: "1rem auto"
        },
        children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              style: {
                fontSize: "1.5rem",
                width: "50vw",
                textAlign: "center",
                borderBottom: "1px solid black",
                paddingBottom: "0.5rem"
              },
              children: title
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: keyword,
              onChange,
              onKeyDown,
              style: {
                padding: "7px 12px",
                border: "1px solid #bdbdbd",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "500",
                margin: "1rem 0"
              }
            }
          ),
          /* @__PURE__ */ jsx("ul", { style: { padding: "1rem", width: "100%" }, children: todos.map(({ name, done }, index) => /* @__PURE__ */ jsx(
            Todo,
            {
              index,
              name,
              done,
              onToggle
            }
          )) })
        ]
      }
    );
  }
};

// example/App.jsx
var App = class extends Component {
  init() {
    this.state = {
      count: 0
    };
  }
  template() {
    return /* @__PURE__ */ jsxs(Template, { children: [
      /* @__PURE__ */ jsx(Header, { children: "Todo app using fake-react" }),
      /* @__PURE__ */ jsx(Todos, { title: "To-do" }),
      /* @__PURE__ */ jsx("div", { children: this.state.count }),
      /* @__PURE__ */ jsx("button", { onClick: () => this.setState({ count: this.state.count + 1 }) })
    ] });
  }
};

// example/index.tsx
var root = document.getElementById("root");
renderRoot(/* @__PURE__ */ jsx(App, {}), root);
//# sourceMappingURL=index.js.map