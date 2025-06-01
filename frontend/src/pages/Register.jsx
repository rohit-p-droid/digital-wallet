import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from "axios";
import GoogleButton from 'react-google-button'
import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.name) {
            setError("Name, Email and password are required");
            return;
        }
        try {
            const url = `${API_URL}/auth/register`;
            const response = await axios.post(url, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                navigate('/login', { state: { message: "Registration successfull! Please login." } });
            }
        } catch (error) {
            if (error.status == 400) {
                setError(error.response.data.message);
            } else {
                setError("Internal Server Error!");
                console.error(error);
            }
        }
    };


    const handleGoogleLogin = () => {
        alert("work in progress");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Register</h2>
                    {error &&
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>{error}</strong>
                            </AlertDescription>
                        </Alert>
                    }

                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <Input
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Register
                        </Button>
                    </form>
                    <div className="mt-4 flex justify-center">
                        <GoogleButton onClick={handleGoogleLogin} />
                    </div>
                    {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
                    <div className="mt-4 flex justify-center">
                        <Button
                            onClick={() => navigate('/login')}
                            className="text-blue-500 hover:underline focus:outline-none"
                        >
                            Already have an account? Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}