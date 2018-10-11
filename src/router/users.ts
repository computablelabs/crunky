// Local Dependencies
import { getUsers } from '../controllers/users'

const routes = (app: any): void => {
  app.route('/')
    .get(getUsers)
}

export default routes

