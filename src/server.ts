// Dependencies
require('dotenv').config()

// Local Dependencies
import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Computable service listening on port ${PORT}`)
})

