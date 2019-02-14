import React from "react"
import { storiesOf } from "@storybook/react"
import { Blog } from "@blog-o-matic/react"

storiesOf("Blog", module)
  .add("Auto-Blog", () => (
    <Blog root="https://static.bpev.me/" />
  ))
