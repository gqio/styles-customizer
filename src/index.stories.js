import { html } from "lit-html";

export const story1 = () => html`
  <custom-element
    .cssCustomProperties=${[
      {
        name: "--color",
        syntax: "<color>",
        initialValue: "rgb(0,0,0)"
      },
      {
        name: "--size",
        syntax: "<length>",
        initialValue: "10px"
      },
      {
        name: "--very-long-border",
        syntax: "<length> <string> <color>",
        initialValue: "1px solid #a00000"
      }
    ]}
  ></custom-element>
`;
