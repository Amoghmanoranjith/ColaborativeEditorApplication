import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { languageAtom, roomNameAtom, userNameAtom } from "../atoms";
import { useAtom } from "jotai";
import { languageOptions } from "../constants/languageOptions";

export default function LandingPage() {
    const [userName, setUserName] = useAtom(userNameAtom);
    const [roomName, setRoomName] = useAtom(roomNameAtom);
    const [, setLanguage] = useAtom(languageAtom);
    const navigate = useNavigate();

    const isFormValid = userName.trim() !== '' && roomName.trim() !== '';

    const handleChange = (e, setter) => setter(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        axios({
            method: 'get',
            url: `http://localhost:8080/join-room/${roomName}`,
        }).then(response => {
            const language_id = response.data.language_id;
            const languageData = languageOptions.find(opt => opt.id === language_id);
            const newLanguageSetting = {
                label:languageData.label,
                value:languageData.value
            }
            setLanguage(newLanguageSetting);
            console.log(userName);
            navigate(`/editor`);
        }).catch(error => {
            throw error;
        });
    };

    const handleCreateRoom = () => {
        navigate("/create-room");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-4 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold font-lexend text-center">Join a Room</h1>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => handleChange(e, setUserName)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-lexend focus:outline-none focus:border-black"
                    required
                />

                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomName}
                    onChange={(e) => handleChange(e, setRoomName)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-lexend focus:outline-none focus:border-black"
                    required
                />

                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`py-2 rounded-lg font-lexend transition-all duration-700 ease-in-out transform
    ${isFormValid
                            ? 'bg-white text-black font-bold hover:bg-black hover:text-white hover:scale-[1.05] hover:shadow-[0_0_0_2px_black]'
                            : 'bg-white text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Join Room
                </button>


                <div className="text-center text-sm font-lexend text-gray-600">
                    Don’t have a room?{" "}
                    <span
                        onClick={handleCreateRoom}
                        className="text-black underline underline-offset-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                        Create one
                    </span>
                </div>
            </form>
        </div>
    );
}
