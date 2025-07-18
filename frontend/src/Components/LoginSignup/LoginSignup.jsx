import React, { useEffect, useState } from 'react';
import './loginSignup.css';
import { useNavigate } from "react-router-dom";
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import logo from '../Assets/logo.png';
import password_icon from '../Assets/password.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginSignup = () => {
    const [loginValues, setLoginValues] = useState({ email: "", password: "" });
    const [signupValues, setSignupValues] = useState({
        name: "",
        scholarId: "",
        email: "",
        metamask: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const navigate = useNavigate();

    const handleLoginChange = (e) => {
        setLoginValues({ ...loginValues, [e.target.name]: e.target.value });
    };

    const handleSignupChange = (e) => {
        setSignupValues({ ...signupValues, [e.target.name]: e.target.value });
    };

    const login = async () => {
        const dummyEmail = "student@nit.ac.in";
        const dummyPassword = "123456";

        if (loginValues.email === dummyEmail && loginValues.password === dummyPassword) {
            localStorage.setItem('authToken', "dummyToken123");
            navigate("/connect-wallet");
            return;
        }

        if (!loginValues.email || !loginValues.password) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginValues),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('authToken', data.token);
                navigate("/connect-wallet");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            alert("Login error");
            console.error("Login error:", error);
        }

    };

    const register = async () => {
        const { name, scholarId, email, metamask, password, confirmPassword } = signupValues;

        if (!name || !scholarId || !email || !metamask || !password || !confirmPassword)
            return alert("All fields are required");

        if (password !== confirmPassword)
            return alert("Passwords do not match");

        try {
            const res = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, scholarId, email, metamask, password }),
            });

            const data = await res.json();
            console.log("Register API response:", res.status, data);

            if (res.ok) {
                alert("Registration successful, please log in");
                document.getElementById('container').classList.remove("active");
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            alert("Signup error");
            console.error("Signup error:", error);
        }
    };

    useEffect(() => {
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');

        const addActive = () => document.getElementById('container').classList.add("active");
        const removeActive = () => document.getElementById('container').classList.remove("active");

        registerBtn.addEventListener('click', addActive);
        loginBtn.addEventListener('click', removeActive);

        return () => {
            registerBtn.removeEventListener('click', addActive);
            loginBtn.removeEventListener('click', removeActive);
        };
    }, []);

    return (
        <div className="container" id="container">
            {/* SIGN UP */}
            <div className="form-container sign-up">
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2 className='heading'>Create Account</h2>
                    <div className="inputs">
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" name="name" placeholder="Name" value={signupValues.name} onChange={handleSignupChange} required />
                        </div>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" name="scholarId" placeholder="Scholar ID" value={signupValues.scholarId} onChange={handleSignupChange} required />
                        </div>
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" name="email" placeholder="Institute Email" value={signupValues.email} onChange={handleSignupChange} required />
                        </div>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" name="metamask" placeholder="Metamask Account" value={signupValues.metamask} onChange={handleSignupChange} required />
                        </div>
                        <div className="input password-input">
                            <img src={password_icon} alt="" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={signupValues.password}
                                onChange={handleSignupChange}
                                required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <div className="input password-input">
                            <img src={password_icon} alt="" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={signupValues.confirmPassword}
                                onChange={handleSignupChange}
                                required
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="button" onClick={register}>Sign Up</button>
                    <p className='text'>Don't have Metamask account, <a href="https://metamask.io/download/" target="_blank" className='link' rel="noreferrer">Create Metamask Account</a></p>
                </form>
            </div>

            {/* LOGIN */}
            <div className="form-container sign-in">
                <img className='img' src={logo} alt="" />
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2 className='heading'>Log In</h2>
                    <span>Use your institute email and password</span>
                    <div className="inputs">
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" name='email' placeholder="Email" value={loginValues.email} onChange={handleLoginChange} required />
                        </div>
                        <div className="input password-input">
                            <img src={password_icon} alt="" />
                            <input
                                type={showLoginPassword ? "text" : "password"}
                                name='password'
                                placeholder="Password"
                                value={loginValues.password}
                                onChange={handleLoginChange}
                                required
                            />
                            <span onClick={() => setShowLoginPassword(!showLoginPassword)} className="eye-icon">
                                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="button" onClick={login}>Log In</button>
                </form>
            </div>

            {/* TOGGLE */}
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep voting, please log in</p>
                        <button className="hidden" id="login">Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello!</h1>
                        <p>Register to vote in university elections</p>
                        <button className="hidden" id="register">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
