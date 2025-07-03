import { useNavigate } from "react-router-dom";
import LanguageChanger from "./LanguageChanger"; // adjust import path if needed
import { useAtom } from "jotai";
import { languageAtom, roomNameAtom, userNameAtom } from "../atoms"; // adjust to your actual atom path
import axios from "axios";
import { languageOptions } from "../constants/languageOptions";

export default function CreateRoom() {
    const [userName, setUserName] = useAtom(userNameAtom);
    const [language] = useAtom(languageAtom);
    const [roomName, setRoomName] = useAtom(roomNameAtom);
    const navigate = useNavigate();

    const isFormValid = userName.trim() !== '';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        const languageId = languageOptions.find(opt => opt.value === language.value)?.id
        const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        axios({
            method: 'post',
            url: 'http://localhost:8080/create-room',
            data: {
                roomName: newRoomId,
                admin: userName,
                language_id: languageId
            }
        }).then(response => {
            if (response.status === 201) {
                setRoomName(newRoomId);
                navigate(`/editor`);
            }
        }).catch(error => {
            throw error;
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-4 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold font-lexend text-center">Create a Room</h1>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-lexend focus:outline-none focus:border-black"
                    required
                />

                <div className="flex justify-center">
                    <LanguageChanger />
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`py-2 rounded-lg font-lexend transition-all duration-700 ease-in-out transform
            ${isFormValid
                            ? 'bg-white text-black font-bold hover:bg-black hover:text-white hover:scale-[1.05] hover:shadow-[0_0_0_2px_black]'
                            : 'bg-white text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Create Room
                </button>

                <div className="text-center text-sm font-lexend text-gray-600">
                    Already have a room?{" "}
                    <span
                        onClick={() => navigate("/")}
                        className="text-black underline underline-offset-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                        Join instead
                    </span>
                </div>
            </form>
        </div>
    );
}
