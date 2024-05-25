const LoginPage = () => {
  return (
    <div className="size-screen flex items-center justify-center h-[100vh]">
      
      <form className="flex flex-col gap-3 sm:gap-4 items-center">
        <h2 className="text-heading mb-5">Login</h2>
        <input className="authField" type="text" placeholder="Username or email" />
        <input className="authField" type="password" placeholder="Password" />
        <button className="mt-5 w-[80%]">Login</button>
        <a href="/signup" className="text-xs sm:mt-3">Create an account</a>
      </form>
    </div>
  )
}

export default LoginPage