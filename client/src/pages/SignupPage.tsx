const SignupPage = () => {
  return (
    <div className="size-screen flex items-center justify-center h-[100vh]">
      
      <form className="flex flex-col gap-3 sm:gap-4 items-center">
        <h2 className="text-heading mb-4">Create Account</h2>
        <input className="authField" type="text" placeholder="Email" />
        <input className="authField" type="text" placeholder="Username" />
        <input className="authField" type="password" placeholder="Password" />
        <button className="mt-4 w-[80%]">Sign Up</button>
        <a href="/login" className="text-xs sm:mt-3">I already have an account</a>
      </form>
    </div>
  )
}

export default SignupPage