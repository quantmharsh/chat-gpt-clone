import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

const App = () => {
	const [value, setValue] = useState(null);
	const [message, setMessage] = useState(null);
	const [previousChats, setPreviousChat] = useState([]);
	const [currentTitle, setCurrentTitle] = useState(null);
	const getMessages = async () => {
		const options = {
			method: "POST",
			body: JSON.stringify(
				//taking value from input field
				{ query: value }
			),
			headers: {
				"Content-Type": "application/json",
			},
		};

		try {
			const response = await fetch("https://gpt-clone-server-d6jj.onrender.com/gpt", options);
			const data = await response.json();
			//storing in variable message (which is in hook) which we are getting from api at data.choices[0].message
			setMessage({role: "assistant", content: data.msg});

			console.log("data", data);
		} catch (error) {
			console.error(error);
		}
	};
	console.log(value);
	console.log(message);

	const createNewChat = () => {
		setMessage(null);
		setValue("");
		setCurrentTitle(null);
	};

	//changing  tab on click
	const handleclick = (uniqueTitle) => {
		setCurrentTitle(uniqueTitle);
		setMessage(null);
		setValue("");
	};

	//for setting up title..
	useEffect(() => {
		if (!currentTitle && value && message) {
			setCurrentTitle(value);
		}
		if (currentTitle && value && message) {
			setPreviousChat((previousChats) => [
				...previousChats,
				{
					//user side
					title: currentTitle,
					role: "user",
					content: value,
				},
				{ title: currentTitle, role: message.role, content: message.content },
			]);
		}
	}, [message, currentTitle]);
	console.log(previousChats);
	const currentChat = previousChats.filter(
		(previousChat) => previousChat.title === currentTitle
	);
	//for assigning uniue title to each title
	const uniqueTitles = Array.from(
		new Set(previousChats.map((previousChat) => previousChat.title))
	);
	console.log(uniqueTitles);
	return (
		<div className="app">
			<section className="side-bar">
				<button onClick={createNewChat}> + New Chat</button>
				<ul className="history">
					{uniqueTitles?.map((uniqueTitle, index) => (
						<li key={index} onClick={() => handleclick(uniqueTitle)}>
							{uniqueTitle}
						</li>
					))}
				</ul>
				<nav>
					<p> Made by Quantam-Harsh</p>
				</nav>
			</section>
			<section className="main">
				{!currentTitle && <h1>Quantam-GPT</h1>}
				<ul className="feed">
					{currentChat?.map((chatMessage, index) => (
						<li key={index}>
							<p className="role"> {chatMessage.role}</p>
							<p>{chatMessage.content}</p>
						</li>
					))}
				</ul>
				<div className="bottom-section">
					<div className="input-container">
						<input value={value} onChange={(e) => setValue(e.target.value)} />
						<div id="submit" onClick={getMessages}>
							❂
						</div>
					</div>
					<p className="info">
						Free Research Preview. ChatGPT may produce inaccurate information
						about people, places, or facts. ChatGPT May 24 Version
					</p>
				</div>
			</section>
		</div>
	);
};

export default App;
