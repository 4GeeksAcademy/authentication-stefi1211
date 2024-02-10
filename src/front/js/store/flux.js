const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		message: null,
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
		users: [],
	  },
	  actions: {
		exampleFunction: () => {
		  getActions().changeColor(0, "green");
		},
  
		changeColor: (index, color) => {
		  const store = getStore();
		  const demo = store.demo.map((elm, i) => (i === index ? { ...elm, background: color } : elm));
		  setStore({ demo: demo });
		},
  
		getMessage: async () => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
			const data = await resp.json();
			setStore({ message: data.message });
			return data;
		  } catch (error) {
			console.error("Oops! Something went wrong while loading the message from the backend.", error);
		  }
		},
  
		signup: async (email, username, name, password) => {
			try {
			  const resp = await fetch(process.env.BACKEND_URL + "/signup", {
				method: "POST",
				headers: {
				  "Content-Type": "application/json",
				},
				mode: "cors",
				body: JSON.stringify({ email, username, name, password }),
			  });
		  
			  const data = await resp.json();
			  setStore({ message: data.msg, response: data });
			  return data;
			} catch (error) {
			  console.error("Oops! Something went wrong while signing up:", error);
			}
		  },
		  
  
		login: async (email, password) => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/login", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({ email, password }),
			});
  
			const data = await resp.json();
  
			if (!data.token) throw new Error("No token received from the server");
			localStorage.setItem("authToken", data.token);
			setStore({ message: data.msg });
			return data;
		  } catch (error) {
			console.error("Oops! Something went wrong while logging in:", error);
		  }
		},
  
		private: async (authToken) => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/private", {
			  method: "GET",
			  headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			  },
			});
  
			const data = await resp.json();
			return data;
		  } catch (error) {
			console.error("Oops! Something went wrong while accessing the profile:", error);
		  }
		},
  
		logout: async () => {
		  try {
			localStorage.removeItem("authToken");
			return { msg: "Logout successful" };
		  } catch (error) {
			console.error("Oops! Something went wrong while logging out:", error);
		  }
		},
	  },
	};
  };
  
  export default getState;
  