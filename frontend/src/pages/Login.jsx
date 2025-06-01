import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "../components/ui/card";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react"
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        if (location.state && location.state.message) {
            setMessage(location.state.message);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }
        try {
            const url = `${API_URL}/auth/login`;
            const response = await axios.post(url, {
                email: formData.email,
                password: formData.password 
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response.status === 200) {
                localStorage.setItem("auth-token", response.data.token);
                navigate('/dashboard', { replace: true });
            }
            
        } catch (error) {
            if(error.status == 401) {
                setError(error.response.data.message);
            } else {
                setError("Internal Server Error!");
                console.error(error);
            }  
        }
    }
    return (
        <div><div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
                    {message &&
                        <Alert className="bg-green-400">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong className='text-black'>{message}</strong>
                            </AlertDescription>
                        </Alert>
                    }
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
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
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
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div></div>
    )
}
