import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Welcome!!</h1>
			<div className="d-grid gap-2 col-6 mx-auto m-5 ">
				<Link to="/login" className="me-5">
					<button className="btn btn-outline-dark" type="button">Login</button>
				</Link>
				<Link to="/signup" className="me-5">
				<button className="btn btn-outline-dark" type="button">Sign Up</button>
				</Link>
			</div>

		</div>
	);
};
