// Import the LitElement base class and html helper function
import { LitElement, html, css, property } from "lit-element";
import { repeat } from "lit-html/directives/repeat";

type syntax =
  | "length"
  | "number"
  | "percentage"
  | "length-percentage"
  | "color"
  | "image"
  | "url"
  | "integer"
  | "angle"
  | "time"
  | "resolution"
  | "transform-function"
  | "custom-ident";

export default class MyElement extends LitElement {
  @property() cssCustomProperties: any[] = [];
  @property() cssValues: Record<string, string> = {};

  static get styles() {
    return css`
      :host {
        font-family: monospace;
      }
      .container {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 10px;
      }
      label {
        min-width: max-content;
      }
      form {
        display: grid;
        grid-template-columns: 1fr 100px;
        align-items: center;
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
      }
      output {
        opacity: 0.7;
      }
    `;
  }

  renderCSSPropSyntax(_syntax: any, initialValue: string) {
    switch (_syntax) {
      case "color":
        return html`
          <input type="color" name="${_syntax}" value="${initialValue}" />
        `;
      case "length":
        return html`
          <input
            type="range"
            name="${_syntax}"
            value="${initialValue.match(/\d/)}"
          />
        `;
      default:
        return html`
          <input name="${_syntax}" value="${initialValue}" />
        `;
    }
  }

  updateCssValue(prop: any, event: any) {
    const form = event.currentTarget;
    const values = [];
    for (const input of form.querySelectorAll("input")) {
      const syntax = `<${input.name}>`;
      const value = input.value + (syntax === "<length>" ? "px" : "");
      values.push(value);
    }
    const _syntax = prop.syntax || "<any>";
    const strings = _syntax.split(new RegExp("<[^>]*>"));
    const cssValue = String.raw({ raw: strings } as any, ...values);
    this.cssValues[prop.name] = cssValue;
    form.querySelector("output").value = cssValue;
    this.dispatchEvent(
      new CustomEvent("inputStyles", {
        detail: this.cssValues
      })
    );
  }

  extractInitialInputValues(prop: any) {
    if (!prop.syntax || !prop.initialValue) return [];
    const syntaxTemplates = prop.syntax.split(new RegExp("<[^>]*>"));
    const initialValueRegexp = syntaxTemplates
      .map(s => s.replace(")", "\\)").replace("(", "\\("))
      .join("(.*)");
    const inputValues = prop.initialValue.match(initialValueRegexp);
    if (inputValues) {
      inputValues.splice(0, 1); // remove the first matching global group
      return inputValues;
    }
    console.warn(
      "Unable to extract input values since it does not match the pattern"
    );
    return [];
  }

  renderCSSPropInput(prop: any) {
    this.cssValues[prop.name] = prop.initialValue;
    const inputSyntaxes = prop.syntax ? prop.syntax.match(/\w+/g) : ["any"];
    const inputValues = this.extractInitialInputValues(prop);
    return html`
      <label>${prop.name}</label>
      <form @input=${e => this.updateCssValue(prop, e)}>
        <span class="controls">
          ${repeat(inputSyntaxes, (s, idx) =>
            this.renderCSSPropSyntax(s, inputValues[idx] || "")
          )}
        </span>
        <output>${this.cssValues[prop.name]}</output>
      </form>
    `;
  }

  render() {
    const content = html`
      <div class="container">
        ${this.cssCustomProperties.map(
          prop =>
            html`
              ${this.renderCSSPropInput(prop)}
            `
        )}
      </div>
    `;
    this.dispatchEvent(
      new CustomEvent("inputStyles", {
        detail: this.cssValues
      })
    );
    return content;
  }
}
