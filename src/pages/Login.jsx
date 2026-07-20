import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post("/auth/login", user);

            if (rememberMe) {

                localStorage.setItem("token", res.data.token);

            } else {

            sessionStorage.setItem("token", res.data.token);

        }

            alert(res.data.message);

            navigate("/");

        } catch (err) {

            console.log(err);

            alert("Invalid Username or Password");

        }

    };

    return (

        <div className="container">

            <div
                className="row justify-content-center align-items-center"
                style={{ minHeight: "100vh" }}
            >

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-header bg-success text-white text-center">

                            <h3>AFBROS Login</h3>

                        </div>

                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label>Username</label>

                                    <input
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        value={user.username}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-4">

                                    <label>Password</label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={user.password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="form-check mb-4">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="rememberMe"
                                        >
                                            Remember Me
                                    </label>

                                </div>

                                <button
                                    className="btn btn-success w-100"
                                >
                                    Login
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;