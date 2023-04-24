import { Outlet, useLocation, useMatch } from "react-router-dom"

export const Root = () => {
  const location = useLocation()
  console.log(location)
  let name = "Login";
  if (location.pathname === '/') {
    name = "Login"
  } else {
    name = "Login"
  }
  return (
    <>
      <Outlet />
    </>
  )
}