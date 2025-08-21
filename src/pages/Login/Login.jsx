import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const navigate = useNavigate();

  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

 
const [loading, setLoading] = useState(false);

const user_auth = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (isSignIn) {
      await login(email, password);
      toast.success("Login successful!", {
        onClose: () => navigate('/'),
        autoClose: 2000
      });
    } else {
      await signup(name, email, password);
      toast.success("Signup successful!", {
        onClose: () => navigate('/'),
        autoClose: 2000
      });
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className='auth'>
      <h1 className="logo" onClick={() => navigate('/')}>MyFlix</h1>

      <div className='auth-container'>
        <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
        <form className='auth-form'>
          {!isSignIn && (
            <input
              type='text'
              placeholder='Full Name'
              required
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          )}
          <input
            type='email'
            placeholder='Email'
            required
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <button onClick={user_auth} type='submit' disabled={loading}>
  {loading ? "Please wait..." : (isSignIn ? "Sign In" : "Sign Up")}
</button>


          <div className='auth-options'>
            {isSignIn && (
              <>
                <label>
                  <input type='checkbox' /> Remember me
                </label>
                <a href='#'>Need help?</a>
              </>
            )}
          </div>
        </form>

        <p className='auth-toggle'>
          {isSignIn ? (
            <>
              New to Myflix?{' '}
              <span onClick={toggleMode}>Sign up now</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={toggleMode} className='sign-in'>Sign in</span>
            </>
          )}
        </p>

        <small className='disclaimer'>
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </small>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default Auth;
