import React from "react"
import { storiesOf } from "@storybook/react"
import { List } from "@blog-o-matic/react"

storiesOf("List", module)
  .add("Empty List", () => (
    <List />
  ))
