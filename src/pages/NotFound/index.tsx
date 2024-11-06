import React from "react"

import { Button, Grid, Heading } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Grid placeItems="center" placeContent="center" height="100vh" gap="sm">
      <Heading>404</Heading>
      <Button onClick={() => navigate("/")}>Home</Button>
    </Grid>
  )
}

export default NotFound
